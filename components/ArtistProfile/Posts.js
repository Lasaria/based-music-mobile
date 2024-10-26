import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Alert, TextInput, Modal } from 'react-native';
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Color';

// DUMMY POSTS DATA
const initialPosts = [
    {
        id: 1,
        username: 'Estella Boersma',
        time: '6h ago',
        content: 'Headlining tonight at the El Rey Theater in Los Angeles! Doors at 9pm, show starts at 10pm. Go to my profile to get your tickets!',
        likes: 2165,
        comments: 418,
        shares: 9,
        liked: false, // New flag to track if the post is liked
        avatar: 'https://s3-alpha-sig.figma.com/img/d828/ea0b/2b2446ec17fd510c8126e76cd7de76d0?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=pmevaE5g9jAepm7iqSj30t2UApaOrBIWAmq3NpQO8At9DL~UiPp-nrIQK~WcVwCK2BCIPVEvwe~k8grXTwRGHbr-5DGJ25NKtqAPXkTyA-MDTfGxzkoDcmgSq3XaKVplcM03dKCA0UKtudnqdvSMdb7mmq0dhAns5g-ItIVjpkZlI69xdLzDatxnMO-Egurx5efuPhW63vB0ku5m5~lx8DLWGPQxeoXzS~qCmOeRUTtpC8X47A7Oy9nkJ2uampPbeY9dAkTGwlVZp6SKdDz9IFNRNgkziAOZDaa1nVB9DCT2HjQJFGVcpNCG3ks0dxHhzmdYE4zL9okS2KASKXbrVg__',
    },
    {
        id: 2,
        username: 'Estella Boersma',
        time: '1d ago',
        content: 'Tour’s been amazing. Los Angeles, Fort Lauderdale, Orlando, Atlanta, Raleigh are up next. See you there!',
        image: 'https://s3-alpha-sig.figma.com/img/0de0/9e60/5f8283339e62a8596ee036050a9a64e8?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=n5BrM6U9N7raL0vrEN4B7wzCi0gD-MK3TjFmp4BqTJ4ji5h85CxIbqjVgeffIeMgt2Y6o0LQuFP6X43E0FPwWDVXlMoVCguclh~2OlfdE0QwnOqvFrIV3VfGcIHQepfvJhoA3eZTg6dOBw3IXUjfxLjx~MTpGXrbki3d8Rw2oktyr8Csoe6u8f1SrDTFljJ494cPUQXUlvcaAmj3V7U8rA73IlfvbAI5g2IjS2wRSKGlYaEFPVA2qIB~Fk97HlI866EJD0eBK-w-amc-zkoJTS6XCwC7JswLMWfiiAT4UWF2qTHBe1uyZ4yIISj~lPrwQ~QkbPPvKtGn3AX08ry0fw__',
        likes: 20100,
        comments: 1400,
        shares: 954,
        liked: false, // New flag to track if the post is liked
        avatar: 'https://s3-alpha-sig.figma.com/img/d828/ea0b/2b2446ec17fd510c8126e76cd7de76d0?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=pmevaE5g9jAepm7iqSj30t2UApaOrBIWAmq3NpQO8At9DL~UiPp-nrIQK~WcVwCK2BCIPVEvwe~k8grXTwRGHbr-5DGJ25NKtqAPXkTyA-MDTfGxzkoDcmgSq3XaKVplcM03dKCA0UKtudnqdvSMdb7mmq0dhAns5g-ItIVjpkZlI69xdLzDatxnMO-Egurx5efuPhW63vB0ku5m5~lx8DLWGPQxeoXzS~qCmOeRUTtpC8X47A7Oy9nkJ2uampPbeY9dAkTGwlVZp6SKdDz9IFNRNgkziAOZDaa1nVB9DCT2HjQJFGVcpNCG3ks0dxHhzmdYE4zL9okS2KASKXbrVg__',
    },
];

const Posts = ({avatarUri, name}) => {
    // POSTS STATES
    const [posts, setPosts] = useState(initialPosts);
    const [editId, setEditId] = useState(null);
    const [liked, setLiked] = useState(false);
    const [editContent, setEditContent] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);


    // LIKES, COMMENTS AND SHARES COUNT FORMATTER
    const formatter = Intl.NumberFormat('en', { 'notation': 'compact' })

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

    // HANDLE LIKE BUTTON PRESS
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

    // FUNCTIONS TO SHOW MODAL WITH EDIT AND DELETE POST
    const showOptions = (id) => {
        setSelectedPostId(id);
        setModalVisible(true);
    };

    const renderPost = ({ item }) => (
        <View style={styles.postCard}>
            <View style={styles.header}>
                {/* ARTIST AVATAR IMAGE */}
                <Image source={{ uri: avatarUri }} style={styles.avatar} />
                <View style={styles.headerInfo}>
                    {/* ARTIST USERNAME */}
                    <Text style={styles.username}>{name}</Text>
                    {/* ARTIST POST TIME */}
                    <Text style={styles.time}>{item.time}</Text>
                </View>
                {/* THREE DOTS OPTION FOR EDIT DELETE POST */}
                <TouchableOpacity onPress={() => showOptions(item.id)}>
                    <Image source={require('../../assets/images/ArtistProfile/morehorizontal.png')} />
                </TouchableOpacity>
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

            {/* Post image if available */}
            {item.image && <Image source={{ uri: item.image }} style={styles.postImage} />}

            {/* POST ENGAGEMENT */}
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
                    <Text style={styles.likes}>{formatter.format(item.likes)}</Text>
                </View>
                <View style={styles.commentsAndShareContainer}>
                    {/* COMMENTS COUNT */}
                    <Text style={styles.comments}>{formatter.format(item.comments)} comments</Text>
                    {/* SHARES COUNT */}
                    <Text style={styles.shares}>{formatter.format(item.shares)} shares</Text>
                </View>
            </View>

            {/* ACTION BUTTONS */}
            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton}>
                    <FontAwesome name={liked ? 'heart' : 'heart-o'} color={liked ? 'red' : 'white'} size={24} onPress={() => {
                        setLiked(!liked)
                        handleLike(item.id)
                    }} />
                    <Text style={styles.actionText}>Like</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Image source={require('../../assets/images/ArtistProfile/chat.png')} />
                    <Text style={styles.actionText}>Comment</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Image source={require('../../assets/images/ArtistProfile/send.png')} />
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
        // DISPLAY ALL THE POSTS
        <FlatList
            data={posts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.container}
            scrollEnabled={false}
        />
    );
};

export default Posts;

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.black,
        paddingBottom: 20,
    },
    postCard: {
        backgroundColor: '#1C1C1C',
        padding: 16,
        borderRadius: 10,
        marginTop: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 35,
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
        height: 100, // Makes the input more like a textarea
        textAlignVertical: 'top', // Ensures the text starts at the top
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
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginTop: 10,
    },
    engagement: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
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
    },
    comments: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: '700',
    },
    shares: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: '700',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        marginHorizontal: 24,
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