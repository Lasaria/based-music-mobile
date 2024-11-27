import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Colors } from '../../constants/Color';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';

const events = [
    {
        id: 1,
        image: 'https://s3-alpha-sig.figma.com/img/55b4/754b/063f86513b45d56567bc364fee718974?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=aTIEZob6ftdi2AM0yW3o6bx8ebEtIR1QGeJ~ggvtqL3oSQ6ZAPV5K1dkKL7zACxX6fRkiOe5KiIRhjO-Zb3WK28ttBkOMElS0zHV~qfeyJsPUJZ0k7jEwDojip6is9pDC7R1WF5Vi83ukr5fxVmTWtzQiSU6ezqOpJzIjMcN94lFMWd6law127S2wc~xVZt~-5ellbaIR1-FdpZHpzkA-eAWNh1Ew3mW3qIMVao5cbmumDMtV-Lk5su9BYR-fCNbhU75BOgiWbeQB3-BkBiulv9tI2YnQHHyE4GlWL4oxGzEcCxp8f6i74PJUX2SP9csQtEpIpgz7KgtoCJ5Wu0nPw__',
        date: 'Tue, Nov 5,2024 at 9PM',
        title: '2024 Fire Festival',
        location: '5849 SW Boulevard, Washington, DC',
        distance: '8 mi',
        interested: '2.3k interested',
        going: '1.2k going'
    },
    {
        id: 2,
        image: 'https://s3-alpha-sig.figma.com/img/089f/d320/c10222774a42edd7a7ca08dd895f7279?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=WWGtnk8olsDoCHxEbr5cyd7LeVonP7Jf78poxgprGKMUreDf1WKP0D0QF41w0PAhzCjEoMHUyWpTRI~~AmQNTtxT5DFOdJYedB71IllQf5PLsZr1IH3e7QkZHdQatDEHa2YkS~W0lTXLar85G3g4eXvIzcX0Qg3Eb6n8l9zAPYOEd27RZDbsyRdt~YcyRQD-lq22ekCzOk2iRlhBh9LAyiC3hp6KQZpJbFHaoW~Up1VFhuhO992K9V-hw-zO5RjtNRb8IfTfkq2vDEs87OKneUXKXcZBD-G7z-b3c3GJRq4IHRjo9NHjlqUOAOuR4Zk7PNACO2ke7SqH8EiaOJKMwQ__',
        date: 'Thu, Nov 10,2024 at 9PM',
        title: 'Disco Night',
        location: '5849 SW Boulevard, Washington, DC',
        distance: '14 mi',
        interested: '115 interested',
        going: '50 going'
    }
];

const groups = [
    {
        id: 1,
        image: 'https://s3-alpha-sig.figma.com/img/089f/d320/c10222774a42edd7a7ca08dd895f7279?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=WWGtnk8olsDoCHxEbr5cyd7LeVonP7Jf78poxgprGKMUreDf1WKP0D0QF41w0PAhzCjEoMHUyWpTRI~~AmQNTtxT5DFOdJYedB71IllQf5PLsZr1IH3e7QkZHdQatDEHa2YkS~W0lTXLar85G3g4eXvIzcX0Qg3Eb6n8l9zAPYOEd27RZDbsyRdt~YcyRQD-lq22ekCzOk2iRlhBh9LAyiC3hp6KQZpJbFHaoW~Up1VFhuhO992K9V-hw-zO5RjtNRb8IfTfkq2vDEs87OKneUXKXcZBD-G7z-b3c3GJRq4IHRjo9NHjlqUOAOuR4Zk7PNACO2ke7SqH8EiaOJKMwQ__',
        title: 'Disco Vibes',
        membersCount: '447',
        memberImages: [
            'https://s3-alpha-sig.figma.com/img/9253/cfb9/9b8a861f94614d0a8958ffb8d1ad5f1d?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=lqzCHqYxC4KIv6YpayGX2ktMb3VtVV50lONX3kRjfpf9-w~9Jybjtgf33s3-5V0Kxf1frsXwK52~F0XrLxWXuUx-Rz0kDxjBy8BgdvTLifTJqW~Frxo1ctToQ-XefQjOdGoLCXH-8My97X~1QC9enima5A29KQxZDziGnh2N3CQfbbTEItvFNBzQ~9BZvxyBsXVqROH7xq0s1bCPpB004JOqXsWFdoUsJ-YmYdS3nsSzq87tPFocM2c9sM2MoweRFBpCGrRGJgPV0IMpdtMWvNAb0xT0EJw~Z3RMOjO8RBXJbk1BplUZI4~2YIsolmTJN0JrhG0Ku3Va5pT6OXpPIg__',
            'https://s3-alpha-sig.figma.com/img/c55d/ef94/e44e69d5bb8503477a7eca59e753bffa?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=I2fCD1dVPDI1k0k1QlLtfIITI7sfkqxVfbBwLf5tRgMDzgkquF2QJ9mijEsclFrsrl6V5fsn0aPatkzGLEJJeFcBrVUSd12irDVBYWlV6HbMeuCB5gmlLWvg188wdRHwIkS7lPgC73ZiPHMrPCKseEoM1jWFG95AaJwELGg2I~9JCOpNOUKwIHVj0jOptJyUmkESPWG-9bv76-0pP0vDdZs-qMQ7KI9HYskgguDJl9uS3M7x3xx9jQC5J1VPOPj3yO1-WM8TTzXDRLtP6oOR2jKaFUPsRYYrClPXHHZl0bIiUW3YRAnIr-ST~rJ2GYFsDiWzgt0no-3reVwswwziag__',
            'https://s3-alpha-sig.figma.com/img/8b25/f292/89e88889188d07ef9624cbc063aa7fc2?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LBjyKBJsWjzd63vpMvGhRr6ELqZVgErnPwNdY0cLc8UC7QxOJ9fDPEDdks5v5DclJ~L5DO8G6lAv42EjEjmn7D1ZhrFTOQPAmg62C2Jnxy5GdCTfekEqEEB2NC2NIuD-n2HTsMWl7ZZJiQxoYl75wy4jEOK7mBLaAd9Mm86NunIvaotMFJ66-NIwSsAe3Fmd1A-sUwteGJ8NYatDmxZeo66FiIU-Xk151QcHmq9vyps1hzIqfiUHR7dYhHmXsPIEEXU3wCmlYYBLqBp7wh02OtMvHD0GGo9283ntv9V4vkg04ioVBcJXxb1yH8rRvdy23UXmo3oWqA2WewOWqQTTCw__',
        ]
    },
    {
        id: 2,
        image: 'https://s3-alpha-sig.figma.com/img/55b4/754b/063f86513b45d56567bc364fee718974?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=aTIEZob6ftdi2AM0yW3o6bx8ebEtIR1QGeJ~ggvtqL3oSQ6ZAPV5K1dkKL7zACxX6fRkiOe5KiIRhjO-Zb3WK28ttBkOMElS0zHV~qfeyJsPUJZ0k7jEwDojip6is9pDC7R1WF5Vi83ukr5fxVmTWtzQiSU6ezqOpJzIjMcN94lFMWd6law127S2wc~xVZt~-5ellbaIR1-FdpZHpzkA-eAWNh1Ew3mW3qIMVao5cbmumDMtV-Lk5su9BYR-fCNbhU75BOgiWbeQB3-BkBiulv9tI2YnQHHyE4GlWL4oxGzEcCxp8f6i74PJUX2SP9csQtEpIpgz7KgtoCJ5Wu0nPw__',
        title: 'Fair 2024',
        membersCount: '647',
        memberImages: [
            'https://s3-alpha-sig.figma.com/img/9253/cfb9/9b8a861f94614d0a8958ffb8d1ad5f1d?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=lqzCHqYxC4KIv6YpayGX2ktMb3VtVV50lONX3kRjfpf9-w~9Jybjtgf33s3-5V0Kxf1frsXwK52~F0XrLxWXuUx-Rz0kDxjBy8BgdvTLifTJqW~Frxo1ctToQ-XefQjOdGoLCXH-8My97X~1QC9enima5A29KQxZDziGnh2N3CQfbbTEItvFNBzQ~9BZvxyBsXVqROH7xq0s1bCPpB004JOqXsWFdoUsJ-YmYdS3nsSzq87tPFocM2c9sM2MoweRFBpCGrRGJgPV0IMpdtMWvNAb0xT0EJw~Z3RMOjO8RBXJbk1BplUZI4~2YIsolmTJN0JrhG0Ku3Va5pT6OXpPIg__',
            'https://s3-alpha-sig.figma.com/img/c55d/ef94/e44e69d5bb8503477a7eca59e753bffa?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=I2fCD1dVPDI1k0k1QlLtfIITI7sfkqxVfbBwLf5tRgMDzgkquF2QJ9mijEsclFrsrl6V5fsn0aPatkzGLEJJeFcBrVUSd12irDVBYWlV6HbMeuCB5gmlLWvg188wdRHwIkS7lPgC73ZiPHMrPCKseEoM1jWFG95AaJwELGg2I~9JCOpNOUKwIHVj0jOptJyUmkESPWG-9bv76-0pP0vDdZs-qMQ7KI9HYskgguDJl9uS3M7x3xx9jQC5J1VPOPj3yO1-WM8TTzXDRLtP6oOR2jKaFUPsRYYrClPXHHZl0bIiUW3YRAnIr-ST~rJ2GYFsDiWzgt0no-3reVwswwziag__',
            'https://s3-alpha-sig.figma.com/img/8b25/f292/89e88889188d07ef9624cbc063aa7fc2?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LBjyKBJsWjzd63vpMvGhRr6ELqZVgErnPwNdY0cLc8UC7QxOJ9fDPEDdks5v5DclJ~L5DO8G6lAv42EjEjmn7D1ZhrFTOQPAmg62C2Jnxy5GdCTfekEqEEB2NC2NIuD-n2HTsMWl7ZZJiQxoYl75wy4jEOK7mBLaAd9Mm86NunIvaotMFJ66-NIwSsAe3Fmd1A-sUwteGJ8NYatDmxZeo66FiIU-Xk151QcHmq9vyps1hzIqfiUHR7dYhHmXsPIEEXU3wCmlYYBLqBp7wh02OtMvHD0GGo9283ntv9V4vkg04ioVBcJXxb1yH8rRvdy23UXmo3oWqA2WewOWqQTTCw__',
        ]
    },
    {
        id: 3,
        image: 'https://s3-alpha-sig.figma.com/img/e952/0499/7f6c9d9cb61e16fc08d6760950a225a4?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LLnKP3dqD5toat-gC6Anl-Xc136P2dmqT6hmM4IkQWB2tzU~QjyI2pW~J5psgDbxUiTRl8x-oAQidxJGcObl1QFQJ8donFf0buSADI0GnM6Ug-H7C10maujuGEx6jgz14mWeNWniMmmuEX8OE60V8rN~t~D7-QR14N4YrWAcrvRVxKBCWfPTFFOoZZyWK~7Idsi5JzU-Ydso~yzIviotbypjOJenMqSQhCMlzMMtf2m4oLRAzNTbbWwsYbVI0ImxcP4rU~N6VLZU7pwKx~qrUGJ5yAVPxVP5USA72HejaTuZFYLf5dxiEkBY2Ri5qY~b-OzbXkCz7YJzOugLsIFISA__',
        title: 'Girl United',
        membersCount: '325',
        memberImages: [
            'https://s3-alpha-sig.figma.com/img/9253/cfb9/9b8a861f94614d0a8958ffb8d1ad5f1d?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=lqzCHqYxC4KIv6YpayGX2ktMb3VtVV50lONX3kRjfpf9-w~9Jybjtgf33s3-5V0Kxf1frsXwK52~F0XrLxWXuUx-Rz0kDxjBy8BgdvTLifTJqW~Frxo1ctToQ-XefQjOdGoLCXH-8My97X~1QC9enima5A29KQxZDziGnh2N3CQfbbTEItvFNBzQ~9BZvxyBsXVqROH7xq0s1bCPpB004JOqXsWFdoUsJ-YmYdS3nsSzq87tPFocM2c9sM2MoweRFBpCGrRGJgPV0IMpdtMWvNAb0xT0EJw~Z3RMOjO8RBXJbk1BplUZI4~2YIsolmTJN0JrhG0Ku3Va5pT6OXpPIg__',
            'https://s3-alpha-sig.figma.com/img/c55d/ef94/e44e69d5bb8503477a7eca59e753bffa?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=I2fCD1dVPDI1k0k1QlLtfIITI7sfkqxVfbBwLf5tRgMDzgkquF2QJ9mijEsclFrsrl6V5fsn0aPatkzGLEJJeFcBrVUSd12irDVBYWlV6HbMeuCB5gmlLWvg188wdRHwIkS7lPgC73ZiPHMrPCKseEoM1jWFG95AaJwELGg2I~9JCOpNOUKwIHVj0jOptJyUmkESPWG-9bv76-0pP0vDdZs-qMQ7KI9HYskgguDJl9uS3M7x3xx9jQC5J1VPOPj3yO1-WM8TTzXDRLtP6oOR2jKaFUPsRYYrClPXHHZl0bIiUW3YRAnIr-ST~rJ2GYFsDiWzgt0no-3reVwswwziag__',
            'https://s3-alpha-sig.figma.com/img/8b25/f292/89e88889188d07ef9624cbc063aa7fc2?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LBjyKBJsWjzd63vpMvGhRr6ELqZVgErnPwNdY0cLc8UC7QxOJ9fDPEDdks5v5DclJ~L5DO8G6lAv42EjEjmn7D1ZhrFTOQPAmg62C2Jnxy5GdCTfekEqEEB2NC2NIuD-n2HTsMWl7ZZJiQxoYl75wy4jEOK7mBLaAd9Mm86NunIvaotMFJ66-NIwSsAe3Fmd1A-sUwteGJ8NYatDmxZeo66FiIU-Xk151QcHmq9vyps1hzIqfiUHR7dYhHmXsPIEEXU3wCmlYYBLqBp7wh02OtMvHD0GGo9283ntv9V4vkg04ioVBcJXxb1yH8rRvdy23UXmo3oWqA2WewOWqQTTCw__',
        ]
    }
];

const posts = [
    {
        id: 1,
        profileImage: 'https://s3-alpha-sig.figma.com/img/a031/ef5a/8d42a1057d8b33ba4ee5a41acc5a2559?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=kz5acbVf9I0apcRPC0B2MG~nzfoopRwIGaCKsaLOekkoZEKLg1nf7p4TghcD8i01CHbuhpC6nkhGTmiJfZPmjvnl6MV~QuxyZdabR83Piv1-L9HQyE1TZYyhbb5bQFqgpc-wwBR0RySWxTlLBb95AnyAPC9URx1T9hO7Yy6UjcOyQ-8meLC8HF0-d~nW-RRe~y63bY1cytUaSdZbprI0i3vTeIm6qSftpUOQte69wURyXEseDvivhDcZHYFneXun8T~1rFsO7bH~a0E79QHqEoGEZQKFrTJIXdazFbEuG7NXJiZQO5tQjETJv-gf9YlREDV4WgSpa7K90eWxfNGnGg__',
        title: 'Throwback Thursday',
        author: 'Ray Simmon',
        content: 'What is everyone wearing? need outfit inspiration.',
        contentImage: null,
        likeCount: 30,
        commentCount: 65,
        shareCount: 11,
    },
    {
        id: 2,
        profileImage: 'https://s3-alpha-sig.figma.com/img/a031/ef5a/8d42a1057d8b33ba4ee5a41acc5a2559?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=kz5acbVf9I0apcRPC0B2MG~nzfoopRwIGaCKsaLOekkoZEKLg1nf7p4TghcD8i01CHbuhpC6nkhGTmiJfZPmjvnl6MV~QuxyZdabR83Piv1-L9HQyE1TZYyhbb5bQFqgpc-wwBR0RySWxTlLBb95AnyAPC9URx1T9hO7Yy6UjcOyQ-8meLC8HF0-d~nW-RRe~y63bY1cytUaSdZbprI0i3vTeIm6qSftpUOQte69wURyXEseDvivhDcZHYFneXun8T~1rFsO7bH~a0E79QHqEoGEZQKFrTJIXdazFbEuG7NXJiZQO5tQjETJv-gf9YlREDV4WgSpa7K90eWxfNGnGg__',
        title: 'Fun Friday',
        author: 'Maya Stevens',
        content: 'Can’t wait for the weekend! What are everyone’s plans?',
        contentImage: null,
        likeCount: 54,
        commentCount: 30,
        shareCount: 5,
    },
    {
        id: 3,
        profileImage: 'https://s3-alpha-sig.figma.com/img/d828/ea0b/2b2446ec17fd510c8126e76cd7de76d0?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=pF3kgB0ce61bkdgaVNGXFScpO2d36jIAejTORIeJgc475MYK3u-3JVxisRZGkKTBZaWBh2HiWzhe7XW6M7SfUP-R2xvsDwNjR-4oimsko7eGC4mQI2vyySJYwGDtggeTIrDalGwx0h8WBX-xqvkKwPlBEpAmxeh3fCGShr-cWAq9UtBaUlFc~5BGODCuuzAdRzZupd9zX03GqGgqpdA4fdmkJQOGBqnOhYGGX7T4AFpbqjA5uwdxteSRbUtalw2Rq~qtRstyD00W1Dz6HmC1Z4uDi9rUrnjrUT2uugbJnK84Lf9snJMQiEURRuTT1DJagAOyr6fJ~YoFcrSMPIzCXg__',
        title: 'Motivation Monday',
        author: 'Alex Johnson',
        content: 'Start your week strong! What’s everyone working on today?',
        contentImage: 'https://s3-alpha-sig.figma.com/img/2dc2/c9fa/16ae09d4caef0f62313b138a5a401ebe?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=JX2M7gdZrmlyslBYIF-pxt5FKn1BhnIv0tO7ZyZRbEthfgstp2NBootjADNqYahFHeZHzMMvB431vo2HTUQea0oKnYS~g7O3CQQhgKtDX2JvDdQvinv5I36rD5fOc6PJmyI6iYn8ZaqyKqasoxxgqWI5~kO3JIFsqV5Y705p5hIK~o0Q6A93NS48LDgqG0QZaRO8wDGYnoCt--KP9bYINC8CwZvgCj8mslmMFxUOftZhvpaUayAAhqIs0k8Ph9m~3J3LY3A-oR4Ra3uO4eL3Ywk9kGFCYDrVMowvliaDVr4MNPRcMeu0EF6vKy-LMJCaRGF0RxQKUC~hcjKnb8qGxg__',
        likeCount: 120,
        commentCount: 40,
        shareCount: 15,
    }
];
const Home = () => {
    const [likes, setLikes] = useState(posts.map(post => post.likeCount));
    const [likedPosts, setLikedPosts] = useState(posts.map(() => false));

    const toggleLike = (index) => {
        const newLikedPosts = [...likedPosts];
        const newLikes = [...likes];
        newLikedPosts[index] = !newLikedPosts[index];
        newLikes[index] = newLikedPosts[index] ? newLikes[index] + 1 : newLikes[index] - 1;
        setLikedPosts(newLikedPosts);
        setLikes(newLikes);
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                {/* What happening this week */}
                <View style={styles.thisWeek}>
                    <View style={styles.topRow}>
                        <Text style={styles.rowTitle}>What’s happening this week</Text>
                        <Text style={styles.showAll}>Show all</Text>
                    </View>

                    {events.map(event => (
                        <View key={event.id} style={styles.eventContainer}>
                            <Image source={{ uri: event.image }} style={styles.eventImage} />
                            <View style={styles.eventDetails}>
                                <View style={styles.eventTopRow}>
                                    <Text style={styles.eventDate}>{event.date}</Text>
                                    <Text style={styles.eventDistance}>{event.distance}</Text>
                                </View>
                                <Text style={styles.eventTitle}>{event.title}</Text>
                                <Text style={styles.eventLocation}>{event.location}</Text>
                                <Text style={styles.eventInfo}>{event.interested}   {event.going}</Text>
                                <TouchableOpacity style={styles.interestedButton}>
                                    <Text style={styles.buttonText}>Interested</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Pupular group */}
                <View styles={styles.groups}>
                    <View style={styles.topRow}>
                        <Text style={styles.rowTitle}>Popular groups for you</Text>
                        <Text style={styles.showAll}>Show All</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                        {groups.map(group => (
                            <View key={group.id} style={styles.groupContainer}>
                                <Image source={{ uri: group.image }} style={styles.groupImage} />
                                <Text style={styles.groupTitle}>{group.title}</Text>
                                <View style={styles.groupCountContainer}>
                                    <View style={styles.membersInfo}>
                                        <View style={styles.memberImagesContainer}>
                                            {group.memberImages.map((image, index) => (
                                                <Image key={index} source={{ uri: image }} style={[styles.memberImage, { left: index * 13, zIndex: index }]} />
                                            ))}
                                        </View>
                                    </View>
                                    {/* Group count */}
                                    <View style={styles.groupCountContainer}>
                                        <Image
                                            source={require('../../assets/images/UserProfile/user.png')}
                                            style={styles.userIcon}
                                        />
                                        <Text style={styles.groupCount}>{group.membersCount}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Post  */}
                <View>
                    {posts.map((post, index) => (
                        <View key={post.id} style={styles.postContainer}>
                            <View style={styles.header}>
                                <Image source={{ uri: post.profileImage }} style={styles.profileImage} />
                                <View style={styles.headerText}>
                                    <Text style={styles.postTitle}>{post.title}</Text>
                                    <Text style={styles.postAuthor}>{post.author}</Text>
                                </View>
                                <Image source={require('../../assets/images/Feed/morehorizontal.png')} />
                            </View>
                            {post.contentImage && <Image source={{ uri: post.contentImage }} style={styles.contentImage} />}
                            <Text style={styles.postContent}>{post.content}</Text>
                            <View style={styles.actions}>
                                <TouchableOpacity onPress={() => toggleLike(index)} style={styles.actionButton}>
                                    <FontAwesome name={likedPosts[index] ? 'heart' : 'heart-o'} size={24} color={likedPosts[index] ? '#FF5A5F' : '#8E8E8E'} />
                                    <Text style={styles.actionText}>{likes[index]}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Image source={require('../../assets/images/Feed/chat.png')} />
                                    <Text style={styles.actionText}>{post.commentCount}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Image source={require('../../assets/images/Feed/send2.png')} />
                                    <Text style={styles.actionText}>{post.shareCount}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.commentBox}>
                                <TextInput style={styles.commentInput} placeholder="Type a message" placeholderTextColor="#8E8E8E" />
                                <FontAwesome name="smile-o" size={24} color="#8E8E8E" style={styles.icon} />
                                <Image source={require('../../assets/images/Feed/send2.png')} style={styles.icon} />
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'red',
        // height: 100,
    },
    thisWeek: {
        display: 'flex',
        width: 360,
        height: 242,
        flexDirection: 'column',
        gap: 8,
        marginTop: 10,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    rowTitle: {
        color: Colors.white,
        fontFamily: "Open Sans",
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 20,
    },
    showAll: {
        color: Colors.white,
        fontFamily: "Open Sans",
        fontSize: 10,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 14,
        opacity: 0.7,
    },
    eventContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        width: 340,
        height: 100,
    },
    eventImage: {
        width: 86,
        height: 95,
        flexShrink: 0,
        borderRadius: 24,
        marginRight: 16
    },
    eventDetails: {
        flex: 1
    },
    eventTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    eventDate: {
        color: Colors.white,
        fontFamily: "Open Sans",
        fontSize: 10,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 14,
        opacity: 0.6
    },
    eventTitle: {
        color: Colors.white,
        fontFamily: "Open Sans",
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: 20,
    },
    eventLocation: {
        color: Colors.white,
        fontFamily: "Open Sans",
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 20,
        opacity: 0.7
    },
    eventInfo: {
        color: Colors.white,
        fontFamily: "Open Sans",
        fontSize: 10,
        fontStyle: 'normal',
        fontWeight: '300',
        lineHeight: 14,
        opacity: 0.8,
        marginVertical: 5,
    },
    interestedButton: {
        backgroundColor: Colors.primary,
        width: 99,
        height: 20,
        paddingVertical: 3,
        paddingHorizontal: 10,
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: Colors.white,
        fontFamily: "Open Sans",
        fontSize: 10,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 14,
    },
    eventDistance: {
        color: '#828796',
        fontFamily: "Open Sans",
        fontSize: 10,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 14,
    },
    groups: {
        display: 'flex',
        width: 343,
        height: 342,
        flexDirection: 'column',
        gap: 8,
    },
    scrollView: {
        marginTop: 14,
    },
    groupContainer: {
        width: 120,
        marginRight: 16
    },
    groupImage: {
        display: 'flex',
        width: 116,
        height: 116,
        borderRadius: 14,
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 25,
    },
    groupTitle: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 8,
        marginBottom: 4
    },
    membersInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        marginTop: 4
    },
    memberImagesContainer: {
        flexDirection: 'row',
        marginRight: 16
    },
    memberImage: {
        width: 20,
        height: 20,
        borderRadius: 21,
        position: 'absolute',
        borderWidth: 2,
        borderColor: 'white',
        bottom: -3,
    },
    groupCountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    userIcon: {
        width: 20,
        height: 20,
        marginLeft: 36,
    },
    groupCount: {
        color: Colors.white,
        fontFamily: 'Open Sans',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: 20,
    },
    postContainer: {
        backgroundColor: '#22252F',
        borderRadius: 12,
        paddingVertical: 20,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    header: {
        flexDirection: 'row',
        marginBottom: 12
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12
    },
    headerText: {
        flex: 1
    },
    postTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    postAuthor: {
        color: '#FFFFFF',
        fontSize: 12,
        opacity: 0.7,
    },
    contentImage: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 12,
    },
    postContent: {
        color: '#FFFFFF',
        fontSize: 16,
        marginBottom: 12,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 12
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 32
    },
    actionText: {
        color: '#FFFFFF',
        fontSize: 14,
        marginLeft: 4
    },
    commentBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#343843',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8
    },
    commentInput: {
        flex: 1,
        color: '#444A5D',
        fontSize: 14
    },
    icon: {
        marginLeft: 12,
        tintColor: '#8E8E8E',
    }
});
