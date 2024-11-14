import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  FlatList, 
  Alert, 
  TextInput, 
  Modal,
  ActivityIndicator,
  ScrollView,
  Dimensions
} from 'react-native';
import { AntDesign, FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { tokenManager } from "../../utils/tokenManager";
import { router } from 'expo-router';
import numeral from 'numeral';
import { Colors } from '../../constants/Color';

import { CommentsSection } from '../CommentsSection';
import { CommentInput } from '../CommentInput';
import { LikesModal } from '../LikesModal';
import { confirmDelete } from '../DeleteConfirmDialog';
import { deleteComment } from '../DeleteActions';
import { formatDate } from '../../utils/functions';

import { SERVER_URL, AUTHSERVER_URL } from '@env';

const API_URL = SERVER_URL;

const Posts = ({ currentUserId, avatarUri, name, isSelfProfile }) => {
    const [posts, setPosts] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [likesModalVisible, setLikesModalVisible] = useState(false);
    const [selectedLikes, setSelectedLikes] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);

    // States for individual posts
    const [showComments, setShowComments] = useState({});
    const [comments, setComments] = useState({});
    const [isLoadingComments, setIsLoadingComments] = useState({});
    const [likeCount, setLikeCount] = useState({});
    const [commentCount, setCommentCount] = useState({});

    useEffect(() => {
        // Initialize states for each post
        const initialStates = posts.reduce((acc, post) => ({
            showComments: { ...acc.showComments, [post.id]: false },
            comments: { ...acc.comments, [post.id]: [] },
            isLoadingComments: { ...acc.isLoadingComments, [post.id]: false },
            likeCount: { ...acc.likeCount, [post.id]: post.likes },
            commentCount: { ...acc.commentCount, [post.id]: post.comments },
        }), {
            showComments: {},
            comments: {},
            isLoadingComments: {},
            likeCount: {},
            commentCount: {},
        });

        setShowComments(initialStates.showComments);
        setComments(initialStates.comments);
        setIsLoadingComments(initialStates.isLoadingComments);
        setLikeCount(initialStates.likeCount);
        setCommentCount(initialStates.commentCount);
    }, [posts]);

    useEffect(() => {
        fetchPosts();
    }, [currentUserId]);

    const fetchPosts = async (pageNum = 1) => {
        // Prevent fetching if already loading or refreshing
        //if (loading || refreshing) return;
    
        //if (!hasMore && pageNum > 1) return;
      
        try {
          const response = await fetch(`${API_URL}/posts/user/${currentUserId}`);
          if (!response.ok) throw new Error('Failed to fetch posts');
          
          const data = await response.json();
          console.log("POSTS", data);
          
          // Check if we've reached the end of the posts
        //   if (data.length < 10) {
        //     setHasMore(false);
        //   }
      
          // Check like status for each post
          const postsWithLikeStatus = await Promise.all(
            data.map(async (post) => {
              //const likeStatus = await checkPostLikeStatus(post.post_id);
              return { ...post };
            })
          );
          
          // If refreshing or first page, replace posts
          // If loading more, append posts
          setPosts(prevPosts => {
            if (pageNum === 1) {
              return postsWithLikeStatus;
            } else {
              // Filter out any duplicates based on post_id
              const existingPostIds = new Set(prevPosts.map(post => post.post_id));
              const newPosts = postsWithLikeStatus.filter(post => !existingPostIds.has(post.post_id));
              return [...prevPosts, ...newPosts];
            }
          });
          
          //setPage(pageNum);
          //setError(null);
        } catch (error) {
          console.error('Error fetching posts:', error);
          setError(error.message || 'Failed to load posts');
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      };

    const fetchComments = async (postId) => {
        setIsLoadingComments(prev => ({ ...prev, [postId]: true }));
        try {
            const token = await tokenManager.getAccessToken();
            const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch comments');
            const data = await response.json();
            setComments(prev => ({ ...prev, [postId]: data.comments }));
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setIsLoadingComments(prev => ({ ...prev, [postId]: false }));
        }
    };

    const handleLike = async (postId) => {
        const isCurrentlyLiked = posts.find(p => p.id === postId)?.liked;
        try {
            const token = await tokenManager.getAccessToken();
            const endpoint = isCurrentlyLiked ? 'unlike' : 'like';
            const method = isCurrentlyLiked ? 'DELETE' : 'POST';
            
            const response = await fetch(`${API_URL}/posts/${postId}/${endpoint}`, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error(`Failed to ${endpoint} post`);
            
            setPosts(posts.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        liked: !isCurrentlyLiked,
                        likes: isCurrentlyLiked ? post.likes - 1 : post.likes + 1
                    };
                }
                return post;
            }));

            setLikeCount(prev => ({
                ...prev,
                [postId]: isCurrentlyLiked ? prev[postId] - 1 : prev[postId] + 1
            }));
        } catch (error) {
            console.error(`Error ${isCurrentlyLiked ? 'unliking' : 'liking'} post:`, error);
            Alert.alert('Error', `Failed to ${isCurrentlyLiked ? 'unlike' : 'like'} post`);
        }
    };

    const handlePressLikes = async (postId) => {
        try {
            const token = await tokenManager.getAccessToken();
            const response = await fetch(`${API_URL}/posts/${postId}/likes`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch likes');
            
            const data = await response.json();
            setSelectedLikes(data.likes);
            setLikesModalVisible(true);
        } catch (error) {
            console.error('Error fetching likes:', error);
            Alert.alert('Error', 'Failed to load likes');
        }
    };

    const handleCommentAdded = (postId, newComment) => {
        setComments(prev => ({
            ...prev,
            [postId]: [newComment, ...(prev[postId] || [])]
        }));
        setCommentCount(prev => ({
            ...prev,
            [postId]: prev[postId] + 1
        }));
        if (!showComments[postId]) {
            setShowComments(prev => ({ ...prev, [postId]: true }));
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        if (isDeleting) return;

        confirmDelete('comment', async () => {
            setIsDeleting(true);
            try {
                await deleteComment(postId, commentId);
                setCommentCount(prev => ({
                    ...prev,
                    [postId]: prev[postId] - 1
                }));
                setComments(prev => ({
                    ...prev,
                    [postId]: prev[postId].filter(c => c.comment_id !== commentId)
                }));
            } catch (error) {
                Alert.alert('Error', 'Failed to delete comment');
            } finally {
                setIsDeleting(false);
            }
        });
    };

    const navigateToProfile = (userId) => {
        router.push({ pathname: 'profileIndex', params: { userId } });
    };

    const handleEdit = (id) => {
        setEditId(id);
        const postToEdit = posts.find(post => post.id === id);
        setEditContent(postToEdit.content);
        setModalVisible(false);
    };

    const saveEdit = async (id) => {
        try {
            const token = await tokenManager.getAccessToken();
            const response = await fetch(`${API_URL}/posts/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: editContent }),
            });

            if (!response.ok) throw new Error('Failed to update post');

            setPosts(posts.map(post => post.id === id ? { ...post, content: editContent } : post));
            setEditId(null);
        } catch (error) {
            console.error('Error updating post:', error);
            Alert.alert('Error', 'Failed to update post');
        }
    };

    const handleDelete = (id) => {
        Alert.alert(
            "Delete Post",
            "Are you sure you want to delete this post?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            const token = await tokenManager.getAccessToken();
                            const response = await fetch(`${API_URL}/posts/${id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            });

                            if (!response.ok) throw new Error('Failed to delete post');
                            setPosts(posts.filter(post => post.id !== id));
                        } catch (error) {
                            console.error('Error deleting post:', error);
                            Alert.alert('Error', 'Failed to delete post');
                        }
                    },
                    style: "destructive"
                }
            ]
        );
        setModalVisible(false);
    };

    const showOptions = (id) => {
        setSelectedPostId(id);
        setModalVisible(true);
    };

    const renderPost = ( item ) => (
        
        <View style={styles.postCard}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.authorContainer}
                    onPress={() => navigateToProfile(item.author_id)}
                >
                    <Image 
                        source={{ uri: item?.profile_image_url || avatarUri }} 
                        style={styles.avatar}
                    />
                    <View style={styles.headerInfo}>
                        <Text style={styles.username}>{item?.username || name}</Text>
                        <Text style={styles.time}>{formatDate(item?.created_at)}</Text>
                    </View>
                </TouchableOpacity>
                {isSelfProfile && (
                    <TouchableOpacity onPress={() => showOptions(item.post_id)}>
                        <MaterialIcons name="more-horiz" size={24} color={Colors.white} />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.contentContainer}>
                {editId === item.post_id ? (
                    <>
                        <TextInput
                            style={styles.textarea}
                            value={editContent}
                            onChangeText={setEditContent}
                            multiline
                            numberOfLines={4}
                        />
                        <TouchableOpacity 
                            onPress={() => saveEdit(item.id)} 
                            style={styles.saveButton}
                        >
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <Text style={styles.content}>{item.content}</Text>
                )}
            </View>

            {item.image_urls?.length > 0 && (
                <ScrollView horizontal style={styles.imageScrollView}>
                    {item.image_urls.map((url, index) => (
                        <Image
                            key={index}
                            source={{ uri: url }}
                            style={styles.postImage}
                        />
                    ))}
                </ScrollView>
            )}

            <View style={styles.engagement}>
                <View style={styles.likesContainer}>
                    <TouchableOpacity onPress={() => handleLike(item.id)}>
                        <FontAwesome
                            name={item.liked ? 'heart' : 'heart-o'}
                            color={item.liked ? 'red' : Colors.white}
                            size={24}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePressLikes(item.id)}>
                        <Text style={styles.likes}>
                            {numeral(likeCount[item.id]).format('0,0a')}
                        </Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity 
                    style={styles.commentsAndShareContainer}
                    onPress={() => {
                        const newShowComments = !showComments[item.id];
                        setShowComments(prev => ({ ...prev, [item.id]: newShowComments }));
                        if (newShowComments) {
                            fetchComments(item.id);
                        }
                    }}
                >
                    <Text style={styles.comments}>
                        {numeral(commentCount[item.id]).format('0,0a')} comments
                    </Text>
                </TouchableOpacity>
            </View>

            {showComments[item.id] && (
                <>
                    {isLoadingComments[item.id] ? (
                        <ActivityIndicator size="small" color="#0000ff" style={styles.loadingIndicator} />
                    ) : (
                        <CommentsSection
                            onCommentDeleted={(commentId) => handleDeleteComment(item.id, commentId)}
                            isDeleting={isDeleting}
                            isLoadingComments={isLoadingComments[item.id]}
                            postId={item.id}
                            comments={comments[item.id] || []}
                            commentCount={commentCount[item.id]}
                            setCommentCount={(count) => setCommentCount(prev => ({ ...prev, [item.id]: count }))}
                            currentUserId={currentUserId}
                        />
                    )}
                    <CommentInput
                        postId={item.id}
                        onCommentAdded={(comment) => handleCommentAdded(item.id, comment)}
                    />
                </>
            )}
        </View>
    );

    return (
        <>
            <View style={styles.container}>
                {posts.map((item) => renderPost(item))}
            </View>

            {modalVisible && (
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.dropdownOverlay}>
                        <View style={styles.dropdownContent}>
                            <Image
                                source={{ uri: avatarUri }}
                                style={styles.modalImage}
                            />
                            <Text style={styles.mainText}>
                                What would you like to do with your post?
                            </Text>
                            <TouchableOpacity
                                style={styles.dropdownOption}
                                onPress={() => handleEdit(selectedPostId)}
                            >
                                <View style={styles.optionRow}>
                                    <AntDesign name="edit" size={32} color="white" />
                                    <Text style={styles.dropdownText}>Edit Post</Text>
                                </View>
                                <Text style={styles.optionDesc}>
                                    Make changes to your post.
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.dropdownOption}
                                onPress={() => handleDelete(selectedPostId)}
                            >
                                <View style={styles.optionRow}>
                                    <MaterialIcons name="delete-sweep" size={32} color="#FE3F56" />
                                    <Text style={[styles.dropdownText, {color: '#FE3F56'
                                }]}>Delete Post</Text>
                                </View>
                                <Text style={styles.optionDesc}>
                                    Permanently remove this post.
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.cancelOption}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.dropdownText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}

            <LikesModal
                visible={likesModalVisible}
                onClose={() => setLikesModalVisible(false)}
                likes={selectedLikes}
            />
        </>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#121212',
        paddingBottom: 20,
    },
    postCard: {
        backgroundColor: '#1C1C1C',
        padding: 16,
        margin: 12,
        borderRadius: 10,
        marginTop: 28,
        marginBottom: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    authorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 35,
    },
    headerInfo: {
        marginLeft: 10,
    },
    username: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
    time: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: '400',
    },
    contentContainer: {
        marginTop: 19,
    },
    content: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '400',
    },
    textarea: {
        backgroundColor: '#333',
        color: Colors.white,
        padding: 10,
        borderRadius: 5,
        height: 100,
        textAlignVertical: 'top',
    },
    saveButton: {
        backgroundColor: Colors.primary,
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
        alignItems: 'center',
    },
    saveButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
    imageScrollView: {
        height: width * 0.7,
        marginTop: 20,
    },
    postImage: {
        width: width - 32,
        height: width * 0.7,
        borderRadius: 10,
        marginRight: 10,
    },
    engagement: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#363636',
    },
    likesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    commentsAndShareContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    likes: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: '700',
        marginLeft: 5,
    },
    comments: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: '700',
    },
    loadingIndicator: {
        padding: 20,
    },
    dropdownOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    dropdownContent: {
        backgroundColor: '#1C1C1C',
        borderRadius: 14,
        padding: 20,
        width: 373,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    modalImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    mainText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: '800',
        textAlign: 'center',
        marginVertical: 10,
    },
    dropdownOption: {
        width: '100%',
        paddingVertical: 15,
        borderRadius: 14,
        borderBottomWidth: 1,
        borderColor: '#363636',
        backgroundColor: '#2A2A2A',
        marginBottom: 10,
        paddingHorizontal: 20,
    },
    cancelOption: {
        paddingVertical: 15,
        backgroundColor: '#363636',
        width: '100%',
        borderRadius: 14,
        alignItems: 'center',
    },
    dropdownText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: '800',
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    optionDesc: {
        color: '#BBBBBB',
        fontSize: 12,
        marginTop: 5,
    },
});

export default Posts;