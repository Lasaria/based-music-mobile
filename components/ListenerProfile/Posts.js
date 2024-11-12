import React, { useState } from 'react';
import { Modal, StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Alert, TextInput } from 'react-native';
import { AntDesign, FontAwesome, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Color';
import numeral from 'numeral';
import NewPostModal from './NewPost';

const initialPosts = [
    {
        id: 1,
        username: 'Humza',
        time: '1d ago',
        content: 'The Big Bad concert was epic! Posting pictures soon!!!',
        likes: 122200,
        comments: 18,
        shares: 6,
        liked: false,
        avatar: 'https://s3-alpha-sig.figma.com/img/d828/ea0b/2b2446ec17fd510c8126e76cd7de76d0?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=dFkjHsK0BrG2idRXmxy8mDyeVCjJiuNJfqbcpDs105GvscgbDw6gDk~O7R28Fgzu-qtjzfXXXo2b1gY94Y2H7s4jgOQUXAsiQnvsqxlp4aotII8zZSQrrCw~3ylKTqpp5OkI5rW0wk1XD2ahrMBhXMtefk4GI5p44WKrAYaliumfxh~SB8G0EeyvAQ7rImkq9AM93tbmkayPCO-c5C6IUw74Fcgar9vRcXszDosEGfrIkKQGzp2j28Htk4nN5gf1tAAtAQRvDfDUwX0iYR4UyB7ESHDkLiWKvKoBPnXv96TKNV-QelGKduXSuduM9zrafiDg49YIaGS1ibGF2RqZEA__',
    },
    {
        id: 2,
        username: 'Humza',
        time: '1d ago',
        content: 'Met so many cool folks at the fire festival last night. Had a blast!',
        likes: 159,
        comments: 150,
        shares: 41,
        liked: false,
        avatar: 'https://s3-alpha-sig.figma.com/img/d828/ea0b/2b2446ec17fd510c8126e76cd7de76d0?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=dFkjHsK0BrG2idRXmxy8mDyeVCjJiuNJfqbcpDs105GvscgbDw6gDk~O7R28Fgzu-qtjzfXXXo2b1gY94Y2H7s4jgOQUXAsiQnvsqxlp4aotII8zZSQrrCw~3ylKTqpp5OkI5rW0wk1XD2ahrMBhXMtefk4GI5p44WKrAYaliumfxh~SB8G0EeyvAQ7rImkq9AM93tbmkayPCO-c5C6IUw74Fcgar9vRcXszDosEGfrIkKQGzp2j28Htk4nN5gf1tAAtAQRvDfDUwX0iYR4UyB7ESHDkLiWKvKoBPnXv96TKNV-QelGKduXSuduM9zrafiDg49YIaGS1ibGF2RqZEA__',
        image: 'https://s3-alpha-sig.figma.com/img/54b7/992c/b09be439b3af917be9f4b27f3215bc67?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=MImq6ucyx5ASCnMdPZ~1KvZy9zPJw8xLFBq2CPRTENR57qTsLsEOF4pviV-hutj7KpP3Mgq1szFJRveGfBCf6juKXIvOEmDbztkp58Qbn5VypmO3v2olmRJiST64r2BTLr4WdwsYsp6VBXtd13cFKWhhx5Yhzbg2BH4oCLgs~3eUMZgQDEbKOl2uEzzYtfOL6L7iAXJ8hcOkZae1OW6lMBnxfcDsFP0jQztWwa77512cEKjikhuCtL423dKc~lKTeIoxsezRUw6u-kHqibyxzCvBjVre8YnCSHl2XmrKEYRJBooJvdXin6R4xisiV5n~zT6PL3xbmPsw26hgUHs~qQ__',
    },
    {
        id: 3,
        username: 'Humza',
        time: '1d ago',
        content: 'Rosebar lounge is always a vibe.',
        likes: 159,
        comments: 150,
        shares: 41,
        liked: false,
        avatar: 'https://s3-alpha-sig.figma.com/img/d828/ea0b/2b2446ec17fd510c8126e76cd7de76d0?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=dFkjHsK0BrG2idRXmxy8mDyeVCjJiuNJfqbcpDs105GvscgbDw6gDk~O7R28Fgzu-qtjzfXXXo2b1gY94Y2H7s4jgOQUXAsiQnvsqxlp4aotII8zZSQrrCw~3ylKTqpp5OkI5rW0wk1XD2ahrMBhXMtefk4GI5p44WKrAYaliumfxh~SB8G0EeyvAQ7rImkq9AM93tbmkayPCO-c5C6IUw74Fcgar9vRcXszDosEGfrIkKQGzp2j28Htk4nN5gf1tAAtAQRvDfDUwX0iYR4UyB7ESHDkLiWKvKoBPnXv96TKNV-QelGKduXSuduM9zrafiDg49YIaGS1ibGF2RqZEA__',
        image: 'https://s3-alpha-sig.figma.com/img/ab31/3cd7/721087e7ab198554ed2b02d70e6c691d?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=n5WQMwtBJD7g6JMYzl59eVBDjKwSgfMie3JI--IfkSJI8RpjFLM3bVeiELjEerMYeYKHx5u7iif8dZ6-tbWiOt8nCBuiFf3aRNFcDbUVHUeIlGAGwkiqdcjy2o5sg5heaw2s~yT7L--IvKv-h6Ulm3aX9xdTfNMrTJSkr4lugm8UTUvfVl9Xz2EMtNUmblSH0J4AR~PYKhZFddSLkCEeE4P6qLglbVz5VZtaH646B092l0jWMaTxBxS4OtSmTSepifgMOmhWziaBzBmxg9E0xyNKfY6dgZImhleM~aLzkT0b0G150yxkoZzjDJlkb7ziLIG2iZU9BJ46nnOEQzrtKA__',
    },
];

const Posts = ({ avatarUri, name, isSelfProfile }) => {
    console.log(isSelfProfile);
    const [posts, setPosts] = useState(initialPosts);
    const [editId, setEditId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [newPostModalVisible, setNewPostModalVisible] = useState(false);


    // FUNCTIONS TO HANDLE EDITING POST
    const handleEdit = (id) => {
        setEditId(id);
        const postToEdit = posts.find(post => post.id === id);
        setEditContent(postToEdit.content);
        setModalVisible(false);
    };

    // SAVE UPDATED POST
    const saveEdit = (id) => {
        setPosts(posts.map(post => post.id === id ? { ...post, content: editContent } : post));
        setEditId(null);
    };

    // FUNCTION TO HANDLE DELETING THE POST
    const handleDelete = (id) => {
        Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
            {
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "Delete",
                onPress: () => setPosts(posts.filter(post => post.id !== id)),
                style: "destructive"
            }
        ]);
        setModalVisible(false);
    };

    const handleLike = (id) => {
        setPosts(posts.map(post => {
            if (post.id === id) {
                return {
                    ...post,
                    liked: !post.liked,
                    likes: post.liked ? post.likes - 1 : post.likes + 1,
                };
            }
            return post;
        }));
    };

    const handleAddPost = (newPost) => {
        setPosts([newPost, ...posts]);
    };

    // FUNCTIONS TO SHOW MODAL WITH EDIT AND DELETE POST
    const showOptions = (id) => {
        setSelectedPostId(id);
        setModalVisible(true);
    };

    const renderPost = ({ item }) => (
        <View style={styles.postCard}>
            <View style={styles.header}>
                <Image source={{ uri: avatarUri || item.avatar }} style={styles.avatar} />
                <View style={styles.headerInfo}>
                    <Text style={styles.username}>{name || item.username}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                </View>
                {isSelfProfile && (
                    <TouchableOpacity onPress={() => showOptions(item.id)}>
                        <Image source={require('../../assets/images/UserProfile/morehorizontal.png')} />
                    </TouchableOpacity>
                )}
            </View>
            {/* POST CONTENT */}
            <View style={styles.contentContainer}>
                {editId === item.id ? (
                    <>
                        {/* TEXTAREA TO EDIT THE POST CONTENT */}
                        <TextInput
                            style={styles.textarea}
                            value={editContent}
                            onChangeText={setEditContent}
                            multiline
                            numberOfLines={4}
                        />
                        {/* SAVE BUTTON FOR EDIT POST */}
                        <TouchableOpacity onPress={() => saveEdit(item.id)} style={styles.saveButton}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    // POST CONTENT 
                    <Text style={styles.content}>{item.content}</Text>
                )}
            </View>

            {item.image && <Image source={{ uri: item.image }} style={styles.postImage} />}

            <View style={styles.engagement}>
                <View style={styles.likesContainer}>
                    {/* LIKE ICONS */}
                    <FontAwesome
                        name='heart'
                        color={'red'}
                        size={24}
                        onPress={() => handleLike(item.id)}
                    />
                    {/*  LIKES COUNT*/}
                    <Text style={styles.likes}>{numeral(item.likes).format('0,0a')}</Text>
                </View>
                <View style={styles.commentsAndShareContainer}>
                    {/* COMMENTS COUNT */}
                    <Text style={styles.comments}>{numeral(item.comments).format('0,0a')} comments</Text>
                    {/* SHARES COUNT */}
                    <Text style={styles.shares}>{numeral(item.shares).format('0,0a')} shares</Text>
                </View>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleLike(item.id)}>
                    <FontAwesome name={item.liked ? 'heart' : 'heart-o'} color={item.liked ? 'red' : Colors.white} size={24} />
                    <Text style={styles.actionText}>Like</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Image source={require('../../assets/images/UserProfile/chat.png')} />
                    <Text style={styles.actionText}>Comment</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Image source={require('../../assets/images/UserProfile/send.png')} />
                    <Text style={styles.actionText}>Share</Text>
                </TouchableOpacity>
            </View>

            {/* DROPDOWN MODAL FOR EDIT OR DELETE POST */}
            {modalVisible && selectedPostId === item.id && (
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.dropdownOverlay}>
                        <View style={styles.dropdownContent}>
                            {/* ARTIST AVATAR */}
                            <Image
                                source={{ uri: avatarUri }}
                                style={styles.modalImage}
                            />
                            {/* MAIN TEXT IN THE MIDDLE */}
                            <Text style={styles.mainText}>What would you like to do with your post?</Text>
                            {/* EDIT BUTTON */}
                            <TouchableOpacity
                                style={styles.dropdownOption}
                                onPress={() => handleEdit(item.id)}
                            >
                                <View style={styles.optionRow}>
                                    <AntDesign name="edit" size={32} color="white" />
                                    <Text style={styles.dropdownText}>Edit Post</Text>
                                </View>
                                <Text style={styles.optionDesc}>Make changes to your post.</Text>
                            </TouchableOpacity>
                            {/* DELETE BUTTON */}
                            <TouchableOpacity
                                style={styles.dropdownOption}
                                onPress={() => handleDelete(item.id)}
                            >
                                <View style={styles.optionRow}>
                                    <MaterialIcons name="delete-sweep" size={32} color="#FE3F56" />
                                    <Text style={[styles.dropdownText, { color: '#FE3F56' }]}>Delete Post</Text>
                                </View>
                                <Text style={styles.optionDesc}>Permanently remove this post.</Text>
                            </TouchableOpacity>
                            {/* CANCEL BUTTON */}
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
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                scrollEnabled={false}
            />
            {isSelfProfile && (
                <TouchableOpacity style={styles.newPostButton} onPress={() => setNewPostModalVisible(true)}>
                    <FontAwesome6 name="plus" size={36} color={'white'} />
                </TouchableOpacity>
            )}
            <NewPostModal
                visible={newPostModalVisible}
                onClose={() => setNewPostModalVisible(false)}
                onAddPost={handleAddPost}
                avatarUri={avatarUri}
                username={name}
            />
        </View>
    );
};

export default Posts;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    listContent: {
        paddingBottom: 80,
    },
    postCard: {
        backgroundColor: '#1C1C1C',
        padding: 16,
        borderRadius: 10,
        margin: 12,
        marginTop: 28,
        marginBottom: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    headerInfo: {
        flex: 1,
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
        opacity: 0.9
    },
    contentContainer: {
        marginTop: 19,
    },
    content: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '400',
        marginBottom: 12,
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
        backgroundColor: Colors.themeColor,
        padding: 16,
        borderRadius: 10,
        marginTop: 10,
        alignItems: 'center',
        marginBottom: 24,
    },
    saveButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    engagement: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    commentsAndShareContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    likesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    likes: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: '700',
    },
    comments: {
        color: Colors.white,
        fontSize: 14,
        opacity: 0.9
    },
    shares: {
        color: Colors.white,
        fontSize: 14,
        opacity: 0.9
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 10,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: '700',
        marginLeft: 5,
    },
    newPostButton: {
        position: 'absolute',
        bottom: 10,
        right: 20,
        width: 64,
        height: 64,
        borderRadius: 40,
        backgroundColor: Colors.themeColor,
        alignItems: 'center',
        justifyContent: 'center'
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
        fontFamily: 'Open Sans',
        fontSize: 18,
        fontStyle: 'normal',
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
    },
    cancelOption: {
        paddingVertical: 15,
        backgroundColor: '#363636',
        width: '100%',
        borderRadius: 14,
    },
    dropdownText: {
        color: Colors.white,
        fontFamily: 'Open Sans',
        fontSize: 18,
        fontStyle: 'normal',
        fontWeight: '800',
        textAlign: 'center',
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    optionDesc: {
        color: '#BBBBBB',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 5,
    },
});