import { StyleSheet, Text, TextInput, View, ScrollView, Image, TouchableOpacity, Modal, ActivityIndicator, Alert, FlatList, Animated } from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Colors } from '../../constants/Color';
import { Feather, FontAwesome6 } from '@expo/vector-icons';
import { tokenManager } from '../../utils/tokenManager';
import { UserService } from '../../services/UserService';


const tracksData = [
    {
        title: "Born to Shine",
        artist: "Diljit Dosanjh",
        duration: '3:32',
        cover_image_url: "https://i.scdn.co/image/ab67616d0000b273e62ca3548e739bd85eebbbc9",
    },
    {
        title: "Ghost",
        artist: "Diljit Dosanjh, thiarajxtt",
        duration: '2:45',
        cover_image_url: "https://i.scdn.co/image/ab67616d0000b273cb2f9520171129a3df7a241a",
    },
    {
        title: "Lover",
        artist: "Diljit Dosanjh",
        duration: '3:09',
        cover_image_url: "https://i.scdn.co/image/ab67616d0000b273ef759d4ae310020a06939e99",
    },
    {
        title: "Chauffeur",
        artist: "Diljit Dosanjh, Tory Lanes, Ikky",
        duration: '3:24',
        cover_image_url: "https://i.scdn.co/image/ab67616d0000b27340e864fc991586ece815b11b",
    },
    {
        title: "Khutti",
        artist: "Diljit Dosanjh, Saweetie",
        duration: '2:12',
        cover_image_url: "https://i.scdn.co/image/ab67616d0000b27388b591944b021192c6c7abb7",
    },
    {
        title: "Jagga Jatt",
        artist: "Ikka, Diljit Dosanjh, Badshah",
        duration: '3:44',
        cover_image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkOJL0fMJpEaNZx8U8ikQis8PG6OHolv4M8A&s",
    },
    {
        title: "Peaches",
        artist: "Diljit Dosanjh",
        duration: '3:09',
        cover_image_url: "https://i.scdn.co/image/ab67616d0000b273010ffee75fd78504689a7d33",
    },
    {
        title: "Hass Hass",
        artist: "Diljit Dosanjh, Sia, Greg Kurstin",
        duration: '2:32',
        cover_image_url: "https://i.scdn.co/image/ab67616d00001e0274a99276badeec2675a9eaec",
    },
    {
        title: "Mombattiye",
        artist: "Diljit Dosanjh, Jaani, Bunny",
        duration: '3:04',
        cover_image_url: "https://i.scdn.co/image/ab67616d00001e02003c49b506f735e39bff82c2",
    },
    {
        title: "G.O.A.T",
        artist: "Diljit Dosanjh, Karan Aujla",
        duration: '3:43',
        cover_image_url: "https://i.scdn.co/image/ab67616d0000b273e62ca3548e739bd85eebbbc9",
    },
    {
        title: "High End",
        artist: "Diljit Dosanjh, Snappy, Rav Hajra",
        duration: '2:56',
        cover_image_url: "https://i.scdn.co/image/ab67616d0000b27322b900bc0c168eaabb46086a",
    },
    {
        title: "Kylie & Kareena",
        artist: "Diljit Dosanjh",
        duration: '2:47',
        cover_image_url: "https://m.media-amazon.com/images/M/MV5BYTkxYzdlZDktMTczYS00NzA0LTkxNDMtOTlhYmMzMGMxZGFjXkEyXkFqcGc@._V1_QL75_UY190_CR74,0,190,190_.jpg",
    },
    {
        title: "Clash",
        artist: "Diljit Dosanjh",
        duration: '2:56',
        cover_image_url: "https://i.scdn.co/image/ab67616d0000b273e62ca3548e739bd85eebbbc9",
    },
]
// DUMMY ALBUM DATA
const albumsData = [
    {
        title: "Ghost",
        release_date: '2023-10-26T16:54:13.692Z',
        cover_image_url: "https://i.scdn.co/image/ab67616d0000b273cb2f9520171129a3df7a241a",
    },
    {
        title: "MoonChild Era",
        release_date: "2024-10-26T16:54:13.692Z",
        cover_image_url: "https://i.scdn.co/image/ab67616d0000b273ef759d4ae310020a06939e99",
    },
    {
        title: "G.O.A.T",
        release_date: "2020-10-26T16:54:13.692Z",
        cover_image_url: "https://i.scdn.co/image/ab67616d0000b273e62ca3548e739bd85eebbbc9",
    },
    {
        title: "Con.Fi.Den.Tial",
        release_date: "2018-10-26T16:54:13.692Z",
        cover_image_url: "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da8447d49ef11062b48af61d2011",
    },
    {
        title: "Drive Thru",
        release_date: "2022-10-26T16:54:13.692Z",
        cover_image_url: "https://i.scdn.co/image/ab67616d0000b273010ffee75fd78504689a7d33",
    },
    {
        title: "Love Ya",
        release_date: '2023-10-26T16:54:13.692Z',
        cover_image_url: "https://m.media-amazon.com/images/M/MV5BNTU4ZDFkYzEtZDYyMy00M2E1LWFkOTktNGQ1ZmM5YmExMzI3XkEyXkFqcGc@._V1_.jpg",
    },
    {
        name: "Culture Scars",
        release_date: '2024-10-26T16:54:13.692Z',
        cover_image_url: "",
    },
    {
        name: "Fake History",
        release_date: '2024-10-26T16:54:13.692Z',
        cover_image_url: "",
    },
    {
        name: "The Best Light",
        release_date: '2024-10-26T16:54:13.692Z',
        cover_image_url: "",
    },
    {
        name: "Cat Company",
        release_date: "Estella Boersma",
        cover_image_url: "",
    },
    {
        title: "Outside",
        release_date: '2024-10-26T16:54:13.692Z',
        cover_image_url: "",
    },
    {
        title: "Leaves and Roots",
        release_date: '2024-10-26T16:54:13.692Z',
        cover_image_url: "",
    },
]
// DUMMY BEATS DATA
const beatsData = [
    {
        title: "Beats 1",
        price: 30,
        cover_image_url: 'https://s3-alpha-sig.figma.com/img/3f5d/b8e2/ffebae1a8f9c4439cbb0690103ff4ac3?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=hnGQ4yjMILuQ7zbf-nP7Je2-rIsUntlraboWcIcIBW1lBfV7w2BXJzQslBXa0YnN2T4G9lU6j~S8CDxfkT~pyW9UYEugFT~vHLpl0HrPrlw1MvCm5WBTyiI5C9fS10O9gXQ8BUZc-B01y4QxHWURb05Z9TWD-9wAhPh1H-UkjIpaQqaG8xaz5ZUgUYWzc3VTXiEl7PEeKYJINZ7txk-32BDOI3H6gBqXrsR4~3Wv~JUnmZXWzXs6qAbrxUOe6ck82nJWhr0tLK7K3DbEwUMh9MJXASU6O83nuqS9KMen-mhIftVVG7GdCwl4KEdtxml7W6VUrQoAvsYis8T7mWex3g__',
    },
    {
        title: "Beats 2",
        price: 30,
        cover_image_url: 'https://s3-alpha-sig.figma.com/img/7e18/683a/fad940bfff8bb9508cc38820519d54c6?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=bTem3TSW1iRORErmDMfXlTv2o4asBtOfkwk3rt~sc7VJlluqo8MzWOsPxR1uZ7W6SXSoDdJV50LSFJtoFABLiw00T9subuiCpoRCl7MldH-N01C8UWfUoK3D~UGo93CngHbEJioPVVqD9iWFRxr4oiP68dUQDscJ6Uv-Mq0-6mzno0nUsUEgxr412hNmGUmVV-uDez9eEnHKKWDt~egEjdTyqIadFsRWxHhFyxuTalAm1x-ooCJGbmn6U5Nmbmw78Txnd6on1Jp~6-ompYYF15v2PHBNldhS81u4ELQZwbvOxyuwrQNplHKy92ecgIaW5ljaYSxPVQSabOUGjkWqFQ__',
    },
    {
        title: "Beats 3",
        price: 30,
        cover_image_url: 'https://s3-alpha-sig.figma.com/img/91fb/0a68/e73e1d530ba0cc7c6a4a9bf5ca52ae79?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=O6d2y7Spc-QBTAnDQRLe-3OMPTDCuJovmIv~9W-cPFRM~~Eo0RjoARyiSiOXqg9jVE~NvsT85LCnH7Mh5d9qtOEGVzYW80w63dQ98-vPDOEw92OptQFZnCAgD5KKYmAHQGdpSLPRvM0MGZ7yTuU2zYFTz9IBVWJ29dOwwAqFiP4O8dT8u9YJTUNWDDE2UqdkmoggAAJXVMRJgd3JoMh7v661z85ZQKCa3wsx7lpm7NB9XR72Nsr6KX1q2MwXASYFK1iC9VFXSKwCzvUsBtigCZqB3Uu~dl4fiRWpezqg9gj4fmHP3Ii0XUX535rou6zb8ICozTYx7mRmkXgeMT2HLQ__',
    },
    {
        title: "Beats 4",
        price: 30,
        cover_image_url: 'https://s3-alpha-sig.figma.com/img/2ee3/9999/a479d216b786ad065af14c3234d66baa?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=D~4S27vvqhgxj53vjQ0Al-m7IeuMgUI4XcwZN4KMP9qhZ5qaylniikU8MWH0X-fUWDwj0wF89~JUi4noZbI8UnoSY5F7G1tMeapca9KINkYyzL5NzTLtSNniPO6RmGSVUCU5eCoVgpA8AlWwkp3a9ryArop7KEDlIioENgG0Oo4Pzkgt3GqYyaDPYlxqwucVpYz13IHiCo8Tn-q6K17pMq1BR8ZtFf0vFRLD3Zo88PNv~K-mNtNRsMbMGE-QbaoeH51WLvqoxGZ48ydoqdmUqWChRAWyDrDb6bGmBL2bL2XrcbBT4EOkeVO-~e~86D9CaWA7agh5scX3l2OlLh~2mw__',
    },
    {
        title: "Beats 5",
        price: 30,
        cover_image_url: 'https://s3-alpha-sig.figma.com/img/0f73/35d7/f5da85bde7096559f3b7cad6e0c502f0?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=J5ecfx9AWzSjV5GNnnLRD2pT2Xu-v8HNb2Ti8bYFJrdx9HciEKcXVA8rFovfDIoK7j4R35hV3p4A23ZJ9GcjKEky22zqCpsIwcrOAFEQcHiHUqAX7RPLInstDfa4~S0i8bI4KxFgJe~ebpHU4Hep0wCIS6BP5Wb0ifuK92AVz2-v4e~jPvBOGD~uCmhGOGh-fKpp9g8VfZlesDZpF4cj0rkuC5JMkKZYHV7N~dyF-MeAq-v4uC-E3CR1O2z-C3T1W~p0sIwDRlF6brJo12Wn9c-ScJ3Fo6R9WmLixndhMBEfX68LBM-GYS3Rvq0F0mIJlR68S5yxHjPSwyRrBf3gVw__',
    },
    {
        title: "Beats 6",
        price: 30,
        cover_image_url: 'https://s3-alpha-sig.figma.com/img/4eb5/b46c/6a0e7948859b1ba7d0d09169e4e28a45?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=WzeHb4aguDMy2CZc~JkM1VRFvduXdEcXxrwQFaXQiyVGN2EHutFqfLX-K4xR6xxrMwdk1Ge1n-CPztCs74ApDyqrRBM9zpZWjGhUulaNstSLD8uCdfuo1eh1jzOUNdOUZM2xScbFNyFKASKvpgDVEZcQVRjEjR19BirlXctnXfoxVKZsvjyzWuZiNQ9A~XzU2cNTBKh~8N6UVYra3AHHbP1tISYzylptNmYoGvh~DyCzX1j0j237zUPuAxRdzI54XwzE9NxYZMkrMfPCLQA1vyd2ZpvJ63HQpdgMqKVmoAjdRjwLvFHv6RI1tsvv~5Hidkv5BdqRl6erJqwQiE5tHg__',
    },
    {
        title: "Beats 7",
        price: 30,
        cover_image_url: 'https://s3-alpha-sig.figma.com/img/a63b/1c5a/cf127bb7e9d013695a8278988aacc08a?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=GcIh4Tv4dw5W3JyIPjE~WWlkvUB7RIxLQjKY~JmZrRaJ38XAS0jyhNy7AaKhqv~BGdzXf~LYb8T5Aw302vIrUjuHFdirtOD-0AAk6pGsnU9Op3~C7aD~fRK20XiM-hH20qpYVj-2pKgJ8uzcPLuHdkff15BrdehdmhXui~zuZsGy6UQbliXykjqhKKwWu77Te65Vm2~9LwbSJPXgoDiF82IddMID3KYm3CvlS64zKY8vfJcKMfW7z6KeUk2-796G9gJv~UdED6cqUPwl7XslaLJgN1vzbDSbwcW8aqvVDdSlMjKoqFO6ETXFmdaaBItlDRCG7t0PpRAAL7uBFLqrnA__',
    },
    {
        title: "Beats 8",
        price: 30,
        cover_image_url: 'https://s3-alpha-sig.figma.com/img/6190/e587/4c0f9faeab9fb4f399eb7056ce8a088c?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=AiAhb6bVE9aGYNbv9uOPLjhN3c-D8scYpw1EehyayVsNbrurM9iPPGxFr9sVqsWAdmOKCZE56NY5yNOipNktM3pZnIILTbYX1woiC2M7Jwni0Kplra6yiqMyfELOk2swYfZxJfzHck3F8fVOYf7hgp2SgCtArEc2DGCb1oP91O4ZqamOFDPXVXK5iQSi6GERtnipETjl--2En5YOy-LmxZxOB7U09iUMk0vFXwOXLrtqJSZD-PrAqhj32fDgaiiDvC5m3ZjRZlftWxEZZoxriBLjT~TTTlJK80cJO9fHX26n9zncB~Gcrd18YGjCgcBS03OW9ZYf0iL9mI0tBxEWew__',
    },
];
// DUMMY SOUNDS DATA
const soundsData = [
    {
        title: "Sound Kit 1",
        price: 30,
        cover_image_url: 'https://s3-alpha-sig.figma.com/img/65d3/636b/ca6e7d6b7a3bdec78925c186472c47c4?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=FLrJXUyVGVPFE~fXe6gGKXb-82AhhTKIe-rT1ZSs9S-EzTaxQUMWbb8JlHor30utMVetPgw-g~SO8tSUc6X-WQIyQTI6rDOnDjaK-EwQBhr6JhM6eASvEdaofEeeYj1qLUlsmFKMHmTAH3v6cOIYfQokHyd5-AOLDDA~q45XxnJRxNdGCVsIfuOVUHcOJJ2LtGJCe~07mv3HIWMsUDwA4K4PHM~-QAZqdT5ogNKvAzSnOTNvBcgyUWth9A-tabpfwyAV3iOdxuDJrFG3z8JOQdRuES3573icgJ9HrQ2Px24PavBa7koj2NQnkU5GrDBqtCz~sWMJbZX-2pUg58ACqA__',
    },
    {
        title: "Sound Kit 2",
        price: 30,
        cover_image_url: 'https://s3-alpha-sig.figma.com/img/edf6/696d/196076f343bc47cf277b71bbaf622c2b?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=G4Yoilgnx6Df6zaaWrY2bzTEXdENb0MUpOo-SbNmLxVRq7im4O8pK1iZjeXBSMo75j40AkiDGW1xctiu9dhNgraSZwR806oD0wBfkwS21HMp~LPyuLV09ttsP43JdxH7UC4wlxerdS9tiaJn63tr53rlRHVdXbdn1JA1oWGsqh2f6uccGzlTClRvxgEN3Lqj5NpZVysEJAbqUJJ8HG0yz5tIBzlggcQXuiuJcEA7jvAX899Ap~L5C9k~mJOayUpkiI8RVrL~~ky4F5WNN8tbOxuTRINZu6VjtUATQNUCFXlc4fHe0-mcehqQ7U1s0MbVHUpV67NnQ~PRD1ORyFgz5w__',
    },
    {
        title: "Sound Kit 3",
        price: 30,
        cover_image_url: 'https://s3-alpha-sig.figma.com/img/2c0c/0708/6a3aaba78b8e1cb88166c9c0f2cff835?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=TuT~u4SOf~Q-xc04vigwE6Jn12G7PKXPhjx2pwZ7EX4Xrprfmy9rkceybQfshVEd7WqKRhfH55LpDe-pin5EAojRoubJ9M7VZAGiVz6kn69OVPKR3nemOJJ35gCT9rb-spBN87Z87x4lnGm~59~L2Sqha97mgKW-lsTRke6cFQEd3LSnevzmfAQEYvixrV9btN4HQX1c7IRAQA~sldjPxA7oE4jcRKaKv3yPTFIwSzk6t4YzZao1AzLug0BQBEFT-3OfqFHBBBCyihgse7F6cQ54N37MXbTm26yX3GO01NfzX~RRLm3mWmLo5BBoBZxz1brrlAHJ9rkgF5oRTxOxHg__',
    },
    {
        title: "Sound Kit 4",
        price: 30,
        cover_image_url: 'https://s3-alpha-sig.figma.com/img/eb89/d6af/aa4ebdc767a10c328a449217719b2af9?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Y~9hoaPKyxr4oSQ8FGPwo9Un2YqAgiM~rdSCQQfOHDjftCn6KlwTG5zAVv2k6WWPDXHdL-4wwWay74R~AFOdxvxCHOinfxltRyFpRT3lrOfKiJURmK8U3Q0Dd6A4JlHu8QvE4cURfQc9OQbTsfQUOLCxLX9Befk2hxc2cVQhbecL8IxexFSgxxPapZ8yEJxCpmKYyzwPY6AJHX3FuO5ifDn4X6Uz8CoxQ9dgIM0biLOzwbmWQXjAcz-ggYPq5sqpL9XpVBXjGGXw1fGl97JnkRHUtx8MIJlJgNH0CHEUcDVbKLaM9u91kKI8RAMk46OfRq4-~UdOfIVPZzYDxrExzQ__',
    },
    {
        title: "Sound Kit 5",
        price: 30,
        cover_image_url: 'https://s3-alpha-sig.figma.com/img/3ec9/cf55/97c532dd362d662d8c32addda504e36f?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=QmCrmp5Pen0NZq0IYJiq-wPmepRbB2RqQFNnJVAAypdFludEKdliKT1eyTYANHEeX-PJwhbZhKVwkVZIRMg0YLxFcxZEhwcIHh1EjmHeDG2FxZMfvPZvFS7I~G-xF9LI0dXYZsdFZutWzq65HJFBhEaGaajsAp-Gtuk2k5gJqKGt1Ci1NOY4ScRJhrWjGBeaXxihuLC4jUOnH0E~2Z6yAkMnTvCkR738R877SsCbVmOJ-CqAupWp2ERz52GO-qS54iiehsfGuU9cJM9OA1V2etT7NF9dP8WnQbtrGb2EUUYL288JaXw~Qx-3ZOUGtbFT2iZV5l~Jkw72YpRgygJvMw__',
    },
    {
        title: "Sound Kit 6",
        price: 30,
        cover_image_url: 'https://s3-alpha-sig.figma.com/img/992e/1a7d/7f3d6dfb35d1ba49720db1c7dcbd8e9c?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=RNfMII1712oMNuQJZz8~SSOfJBWeH-BTSW9~TOY5xZ~KZldZiho2iqnKMcxuDQ0V4i-u1PMyf9YRSK7jQ2shF99KkoNJGx~zPi~Bfib30rvdvHcP-wPV31PI-vnDlSW8~mzRJOSXzy8Cra6eTYKXgeftNZlqFYX~Ah9XaF7cKH3Bl5AfhJ8Ztp7ynXzcYVbxZQibiX5zGf3Xmvo28x3At4BcrTuCXsV0nv6fMCMvrAqU-byU~VUiia6apuJ6mo4VKvWgGg9AtOSH49nbM1qp0UchXf2DNubOEZtiu7aDsk-VmJoU67~wtwNqjKtNU8MiEgdpTKZnDBGenaloMeFMdg__',
    },

    {
        title: "Sound Kit 7",
        price: 30,
        cover_image_url: 'https://s3-alpha-sig.figma.com/img/ffe5/52ef/ff8a49d8f3d3b27767f56df4b104337f?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Grhyoi~YwIYcy-X~K0NEdUWAuLfxRbt7kuvAe3xdI71xzExGS1ouWN930DHPiuouz~U~feHQ3PlPHl~wXoORj4js~WLcMtEUgFGNIooyAS7ukti9skmJu3mSvwseIrnTeixo1PuH3H5OqO4sH5swzX7adJvbzQlPpsBHKwAa6tCyTtpJsIi47r3yWSazml2CCzvvAXF68aJqhYjWNnMBJoe9NgZrKL7T8BtnHV-RpsoV3Nw8wybJB7TsE4VgFhPd9n4PAmCecRh9xZ3SzuI~5DZwXiEmaIgEwJr7qrvXcpOZ~VTQMzqTqgtLAUYUMUO6vG61Z0RJewSK0DYL3FLoBw__',
    },
    {
        title: "Sound Kit 8",
        price: 30,
        cover_image_url: 'https://s3-alpha-sig.figma.com/img/ee36/4a40/3f306befeea4d06c18d353d0759f8942?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=dX--wnbUZzrFxYJNQV1ykzNPWganQYflkvhr8sEEazL1qPSdS41k0ynJUrjrTZD5jW467OHkXPPVbDOId73srhpgj-x2gb8B3yKwPJmXmBV7BLjFZl7BY7SYPzptxN2jqygXOrRr0ANt3x4UgFAZenqO-Ppy8UN7O8Ucfv5prqhjlVYbxjcO0NVCjXtk1B65ksakmaAIwGsdc3Pxt3JkPwjjbjlfLnQK9C7sh~M2694DpdfgWKxCKEp5PDq6cjgcSjBI3zcf4W4IUDUfmGnwgeLqs51jhgtB8MoiQwSx8~BYOfGnMH2cLFXLI-YMLG3MSKDu9xEoMmIx0rX~RtuK-g__',
    },
]
// DUMMY PRESETS DATA
const presetsData = [
    {
        title: "Preset 1",
        price: 30,
        cover_image_url: 'https://s3-alpha-sig.figma.com/img/6711/f55d/f124481db193ef9e2265176b8ec872ba?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=EMftmw68CNzQkLaV6zjWoJSxfk3RYjbjog9Jy-s2SST3Z7bpSQyxqc7Och0bU62~Z5IuqAZ3tBASZi2jSWW0RWKMDaleQukPVE8DTxtxG7xsec~GSgC4ruJ8YAs3uKm9u9~Sm3VF2gFHL5rxE46svz9JVdZxVabBgP0aecd5oTFtWspa83v0KkWsRcD1zTc68efsWe5ZdtTeDceHXgDQhaHg7DpL0njF4kjbK0550QbHgiirAKwnm4eMSFGjJpZ6MEF8tJgqpwHQ~Dy2ajFIgZiRgeqbWL9aw7FsblUVtE~ellW56c2i6hlPG7Ydcy5GspPZ9mYOYJsHKtURSPLWDw__',
    },
    {
        title: "Preset 2",
        price: 30,
        cover_image_url: 'https://s3-alpha-sig.figma.com/img/f0b9/1533/5920573f8bbe3144656525ae5d7c855d?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=E-Cg0Z8AnpLD51CLiKTaH81FxyUlH5wjeqIOKCJsppJ5obxs9xPApT23V6pJHnLuB8x-ImY2ewzjLy3tKLQVB~h8lDE5jpJ~3eEX4zrVR4WaqXFIRMw-MRr294yB~X5da~bJJo0-OOG9xi-fKm3Y6EtStCWosXmz4dwI1cmUpHsaYZ3hBOIJ5RMTGYC6jBx16JzeY4qmGBXck2ok0U-2uL8yuNzIMQh6URbZxnIGqidySy3i9FK2JxMqadA6LKzNlL1zZuAuJY32teNFk3FALZKOnbjsMAk6KIin57V1bAvFjgmb5TJZ2s1nzZ5dxBhzLnUaMwlrvkRGHLMvhwVYyA__',
    },
    {
        title: "Preset 3",
        price: 30,
        cover_image_url: 'https://s3-alpha-sig.figma.com/img/3e31/c9d9/1393edc517a22b0bdc17fa3aa9608314?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Tqw6f1g6mgVvfkAvou3naR1eZAiAvEmlHGzLd5Vrk9VxNPQlfzd-Oc4JiujqFjvELrlvPgikQE89D-hGL2nLVBOA9tfKg0cKnq2~4eWuSXQOvS0abQFy7liE4740gUVWLGorFX0Snfyf5FT4GNkyafxFlfmhl0EzblSTvkxn3zQgOgEFVbpdbTYjPaBmAwp1BMYld9hE29A5jNoB1zyn9LCmriK4q8bLwUGXKk7gbUaSJjfY5tTz8vK0EcLFAILrY6j7VGD4V-JrFnv8q6tkeF86FYLsDmqPkioqHvPZW~v0BuTOyEweKyOVlLeCH0kcti7NaofSEhTMSkYS1YTU8g__',
    },
    {
        title: "Preset 4",
        price: 30,
        cover_image_url: 'https://s3-alpha-sig.figma.com/img/3e0c/d395/7535a1eeddf49d6352d9d45d77f45c40?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=e4-vqP-YGq0b0VKdrUA7~VypBOdnwBZGEM7gTnHbNgiyBIYOcslApL~6w1iCHH2ofra-DgVDyXlRlgTHhl1yh5-llB1pPMfoa921wKR1UUuWdAyHzBt4zt4GD~xRv~3wNRQBYeJ7B~xRBIhvun99nt9Qzsw81xfuZHcT3yiXuXULS3rBMk5NwwBhjwvqB8JzjuVBC~UPdU8H56jHAk3NJ6asnN7hPKrH4iOgqs4STEJTXbG1fiRhdnAI9m2g0zLmUzSZyMrY1pvofmiCEh~wCiH4Lt8FOSiyO1wHHPGYXlaR0weoUvB-SGVz7mNiunG9ja85-i2kqETiZir7Uaai4w__',
    },
    {
        title: "Preset 5",
        price: 30,
        cover_image_url: 'https://s3-alpha-sig.figma.com/img/4990/7145/df16cca441bfdc13f57d34a72ec6f47c?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=TjiV-cuTolJKLqqf8Nd2Z-7zcg9p8xihsz-XUgGxKWCSWfexZg6brV6k4C~l5PUZyr8gwKGJMeSxr6Ssm2qdhH0WRCWMPfJ60z3v9jZnnCcqQdHqol5VJrHk3D7~e9NWO-H9PSlP-XfYJNXqpUnNuGelfwI5fhSf8l06AP69xTTUFz9FvLJd2mHk2Nb0tIJG0THcqpuirMxoX3QaOYIM6xKC2mMXGu2ixzAfLB6nOM42MWQW6YDgsIT9-cp4RBi~eEdOlBd0xcyzeF~0XJse0pmarNSezgi-Nkb5HAY2DBi0tmCksgP6O0SrcFF0ggHHsBHEiPt4Xxq~ikWCUC-sYA__',
    },
    {
        title: "Preset 6",
        price: 30,
        cover_image_url: 'https://s3-alpha-sig.figma.com/img/d8f6/a79d/5214f3b2c45cf2bb23e1b90d5b88e422?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=OqxL3AIy8vD0qUn2RqMkwBR3aqTf~AM0RIEzPBPhZYzFUQWh~HzwxDfBo5lcioWSh3JH8jLwmYymkF4BhHhlh0ml1sNUTWqmD5QMr1BKNue1cTxRQX0geEXMGmHmZ2CQVNhFhZIcEjaRaSoe-zhM~kqPYndGJVwIofQ-FUhLnNIbdujD1qlm6nvLqbVTuxpe9bXwMgsob0FoOwtNVlxPAj15~-ANMpvySyG-7vDmUD4xd8iqJXRbSFghJCzrzbxL2CuV631NqMKynOZn7NN~-XTTR51VvyHyrLLhsgZC6~ISirD7uLfT8dGkIIdIqOO~tyFeL3G9V3Cvcn2XDZGmBA__',
    },
    {
        title: "Preset 7",
        price: 30,
        cover_image_url: 'https://s3-alpha-sig.figma.com/img/73b7/cc0f/bae44fd92feef80806d4226a0c187b75?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=aet7VuIPdvxio9tq0yrK4g890CmpSIRsxLnDuivBiLIycLGOUOf4ZjsEWU1piPGPbFK841gZB6sR~lpkU9a0oIMbbA-VyzL2w9sfwLTDzzNuzqOb0A7w2T5c0XAsNe8bb3HrDzjAP7yrIHsz0gPBcPQHwqVdt1V7kbs9Z46F9H2mqy2VSIWuR-dWe99M85td194UAC7ef~MkK17XKtZV3s-BPMxcZWL49-0cJ1JYSZSzVOkT204U0J6PICEe-OgfO61MRkQage0aoomTbpbEYjuUtb17T3~jwpOz73K~0CgvyHfrrQs9bC6rj3TH7d3ehn0SBkyOl95ftnmUWjDhEg__',
    },
    {
        title: "Preset 8",
        price: 30,
        cover_image_url: 'https://s3-alpha-sig.figma.com/img/b97e/7614/71dcb662650ee2f2781e85a9b975de5d?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=O5lUrQDYNfrTe8wUT3sU4dSSmFVWoGlu9LqyENnaii17wv9f0z1yA~9YatDSn~ma0tism8-dwYwCLfrs~-Bi1W~n-r3kMvtFFDq2mIoIcWHXUkZIRpc5c3iy7as2-5Ty7P0jsSsHLTfhUfe9T~CELlkpn7kQbzeswNmT~l-~3nAJ9unnRczyJumM9v-qQDJnHeqa53-1~GKCngMSohr1WGVsBSWNRYUi7uR1xuZ1Zj6GfYKQ2HU2bpXrqz1~cUIwHBgpMhOi0-QRFrzgd6z6sblFOldTVKY1tNCCQcnxdI~1xOesUg9gw9k8FdCcMoQ6RUbecLGdNVACbvj3CfSDHg__',
    },
]

// PLACEHOLDER FOR SEARCH INPUT
const searchPlaceholders = ["Search for tracks", "Search for albums", "Search for beats", "Search for sounds", "Search for presets"];

const Music = ({ name, isSelfProfile }) => {
    const [isSelecting, setIsSelecting] = useState({
        tracks: false,
        albums: false,
        beats: false,
        sounds: false,
        presets: false
    });
    const [showAll, setShowAll] = useState({
        tracks: false,
        albums: false,
        beats: false,
        sounds: false,
        presets: false
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState({ tracks: true, albums: true, beats: false, sounds: false, presets: false });
    const [modalContent, setModalContent] = useState({
        type: '',
        text: '',
        description: '',
    });

    const [albums, setAlbums] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [beats, setBeats] = useState(beatsData);
    const [sounds, setSounds] = useState(soundsData);
    const [presets, setPresets] = useState(presetsData);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const opacity = useRef(new Animated.Value(0)).current;
    const lastAlbumKeyRef = useRef(null);
    const lastTrackKeyRef = useRef(null);
    const [searchText, setSearchText] = useState('');
    const [currentPlaceholder, setCurrentPlaceholder] = useState(searchPlaceholders[0]);
    const albumsRef = useRef([]);
    const tracksRef = useRef([]);


    // FETCH ALL DATA FOR TRACKS, ALBUMS, BEATS, SOUNDS AND PRESETS
    const fetchData = useCallback(async (isInitialFetch = false) => {
        try {
            setLoading((prev) => ({ ...prev, tracks: true, albums: true }));
            const artistId = await tokenManager.getUserId();

            // Fetch albums
            const albumsResponse = await UserService.fetchAlbums('912312838', lastAlbumKeyRef.current);
            if (albumsResponse.albums && Array.isArray(albumsResponse.albums)) {
                albumsRef.current = isInitialFetch
                    ? albumsResponse.albums
                    : [...albumsRef.current, ...albumsResponse.albums];
                setAlbums([...albumsRef.current]);
                lastAlbumKeyRef.current = albumsResponse.lastEvaluatedKey;
            }

            // Fetch tracks
            const tracksResponse = await UserService.fetchTracks('912312838', lastTrackKeyRef.current);
            if (tracksResponse.tracks && Array.isArray(tracksResponse.tracks)) {
                tracksRef.current = isInitialFetch
                    ? tracksResponse.tracks
                    : [...tracksRef.current, ...tracksResponse.tracks];
                setTracks([...tracksRef.current]);
                lastTrackKeyRef.current = tracksResponse.lastEvaluatedKey;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading((prev) => ({ ...prev, tracks: false, albums: false }));
            setIsFetchingMore(false);
            if (isInitialFetch) {
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }).start();
            }
        }
    }, []);

    // FETCH DATA ON SCREEN MOUNT
    useEffect(() => {
        fetchData(true);
    }, [fetchData]);


    // TOGGLE THE SELECT AND UNSELECT MODE FOR DELETE
    const handleToggleSelectMode = (type) => {
        setIsSelecting((prev) => ({
            ...prev,
            [type]: !prev[type],
        }));
        setSelectedItems([]); // Clear selected items when switching to select mode
    };

    // CLEAR SELECTION AND EXIT SELECT MODE
    const handleClearSelection = () => {
        setSelectedItems([]);
        setIsSelecting({ tracks: false, albums: false, beats: false, sounds: false, presets: false });
    };

    // HANDLE 'EXIT' ACTION TO RESET SELECTION AND SHOW LIMITED ITEMS
    const handleExit = (type) => {
        setSelectedItems([]); // Clear selected items
        setShowAll((prev) => ({ ...prev, [type]: false })); // Exit "Show All" mode
        setIsSelecting({ tracks: false, albums: false, beats: false, sounds: false, presets: false }); // Exit selection mode
    };

    // HANDLE TOGGLE SHOW ALL FOR DISPLAY ALL THE DATA
    const handleToggleShowAll = (type) => {
        setShowAll((prev) => ({ ...prev, [type]: !prev[type] }));
        setIsSelecting((prev) => ({ ...prev, [type]: false }));
        if (!showAll[type]) setSearchText(''); // Clear search text when opening search
    };

    // FUNCTION TO DETECT SELECTED ITEM
    const handleSelectItem = (type, item) => {
        if (isSelecting[type]) {
            // Allow only one item to be selected at a time
            setSelectedItems((prev) =>
                prev.includes(item) ? [] : [item]
            );
        }
    };

    // HANDLE FUNCTION TO DELETE SELECTED ITEM
    const handleDeleteSelectedItems = (type) => {
        if (selectedItems.length === 0) {
            Alert.alert('No Selection', `Please select a ${type.slice(0, -1)} to delete.`);
            return;
        }
        setModalContent({
            type,
            text: `Delete selected ${type.slice(0, -1)}?`,
            description: `Do you really want to delete the selected ${type.slice(0, -1)}? This can't be undone.`,
        });
        setShowDeleteModal(true);
    };

    // GET YEAR FROM ALBUMS CREATED_AT FIELD 
    function handleGetYearFromDate(dateString) {
        const date = new Date(dateString);
        return date.getFullYear();
    }

    // FUNCTION TO FORMAT THE TEXT LENGTH
    const handleFormatText = (text, maxChars) => {
        if (text.length <= maxChars) {
            return text;
        } else {
            return text.slice(0, maxChars) + '...';
        }
    }

    // HANDLE FUNCTION TO CONFIRM DELETED SELECTED ITEM
    const handleConfirmDeleteSelectedItem = async () => {
        const itemType = modalContent.type;
        try {
            if (selectedItems.length === 1) {
                const itemId = selectedItems[0][`${itemType.slice(0, -1)}_id`];
                if (itemType === 'albums') {
                    await UserService.deleteAlbum(itemId); // Call deleteAlbum for albums
                    setAlbums((prev) => prev.filter((item) => item.album_id !== itemId));
                } else {
                    await UserService.deleteTrack(itemId); // Call deleteTrack for tracks
                    setTracks((prev) => prev.filter((item) => item.track_id !== itemId));
                }
                setIsSelecting((prev) => ({ ...prev, [itemType]: false }));
                setSelectedItems([]);
            } else {
                Alert.alert('Selection Error', `Please select only one ${itemType.slice(0, -1)} to delete.`);
            }
        } catch (error) {
            console.error(`Failed to delete selected ${itemType.slice(0, -1)}:`, error.message);
        } finally {
            setShowDeleteModal(false);
        }
    };

    // HANDLE FUNCTION FOR CANCEL SEARCH BUTTON
    const handleCancelSearch = () => {
        setSearchText('');
        setShowAll({
            tracks: false,
            albums: false,
            beats: false,
            sounds: false,
            presets: false
        });
    };

    const isAnyShowAllActive = Object.values(showAll).some(value => value);

    // SHOW DELETE MODAL UI
    const renderDeleteModal = () => (
        <Modal
            visible={showDeleteModal}
            transparent
            animationType="slide"
            onRequestClose={() => setShowDeleteModal(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Image source={require('../../assets/images/UserProfile/delete.png')} style={styles.deleteImage} />
                    <Text style={styles.modalText}>{modalContent.text || 'Delete this selection?'}</Text>
                    <Text style={styles.modalTextDesc}>{modalContent.description || 'Do you really want to delete this selection? This can’t be undone.'}</Text>
                    <View style={styles.modalActions}>
                        <TouchableOpacity onPress={() => setShowDeleteModal(false)} style={styles.cancelButton}>
                            <Text style={styles.buttonText}>No, Keep it.</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleConfirmDeleteSelectedItem}
                            style={[styles.deleteButton, selectedItems.length === 0 && styles.disabledDelete]}
                            disabled={selectedItems.length === 0}
                        >
                            <Text style={styles.buttonText}>Yes, Delete!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    useEffect(() => {
        const placeholderInterval = setInterval(() => {
            setCurrentPlaceholder(prev => {
                const currentIndex = searchPlaceholders.indexOf(prev);
                const nextIndex = (currentIndex + 1) % searchPlaceholders.length; // Loop back to the first
                return searchPlaceholders[nextIndex];
            });
        }, 2500);

        return () => clearInterval(placeholderInterval); // Cleanup the interval on unmount
    }, []);

    // SHOW TRACKS, ALBUMS, BEATS, SOUNDS, PRESETS LAYOUT
    const renderItemsSection = (type, data, title) => {
        // Filter the data based on the search text for all types
        const filteredData = data.filter(item =>
            item.title && item.title.toLowerCase().startsWith(searchText.toLowerCase())
        );

        // Determine how much data to display based on showAll flag
        const displayedData = showAll[type] ? filteredData : type === 'tracks' ? filteredData.slice(0, 5) : filteredData.slice(0, 6);

        // Determine the render item function based on the type
        const getRenderItem = () => {
            switch (type) {
                case 'beats':
                    return renderBeatItem;
                case 'sounds':
                    return renderSoundItem;
                case 'presets':
                    return renderPresetItem;
                case 'albums':
                    return renderAlbumItem;
                default:
                    return renderTrackItem;
            }
        };

        // Check if the initial data fetch is complete or if data is actually unavailable
        const isDataUnavailable = data.length === 0 && !loading[type];

        return (
            <View style={styles.section}>

                <View style={styles.header}>
                    <Text style={styles.sectionTitle}>{title}</Text>
                    <View style={styles.actionButtons}>
                        {!isSelecting[type] && displayedData.length > 0 ? (
                            <>
                                {showAll[type] ? (
                                    <>
                                        <TouchableOpacity onPress={() => handleExit(type)}>
                                            <Text style={styles.showAll}>Exit</Text>
                                        </TouchableOpacity>
                                        {isSelfProfile && (
                                            <TouchableOpacity onPress={() => handleToggleSelectMode(type)}>
                                                <Text style={styles.editText}>Edit</Text>
                                            </TouchableOpacity>
                                        )}
                                    </>
                                ) : (
                                    <TouchableOpacity onPress={() => handleToggleShowAll(type)}>
                                        <Text style={styles.showAll}>Show All</Text>
                                    </TouchableOpacity>
                                )}
                            </>
                        ) : selectedItems.length > 0 && displayedData.length > 0 ? (
                            <>
                                <TouchableOpacity onPress={() => handleClearSelection(type)}>
                                    <Text style={styles.cancelText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDeleteSelectedItems(type)}>
                                    <Text style={styles.deleteText}>Delete</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            displayedData.length > 0 && (
                                <TouchableOpacity onPress={() => handleClearSelection(type)}>
                                    <Text style={styles.cancelText}>Cancel</Text>
                                </TouchableOpacity>
                            )
                        )}
                    </View>
                </View>

                {isDataUnavailable ? (
                    <View style={styles.noDataContainer}>
                        <Text style={styles.noDataText}>No {title} Available</Text>
                    </View>
                ) : displayedData.length === 0 && searchText ? (
                    <View style={styles.notFoundContainer}>
                        <Text style={styles.notFound}>Couldn't find</Text>
                        <Text style={styles.notFoundQuery}>"{searchText}"</Text>
                        <Text style={styles.notFoundQuerySmall}>Try searching again using a different spelling or keyword</Text>
                    </View>
                ) : ['beats', 'sounds', 'presets'].includes(type) ? (
                    showAll[type] ? (
                        <FlatList
                            data={displayedData}
                            renderItem={getRenderItem()}
                            keyExtractor={(item, index) => item.id || index.toString()}
                            numColumns={2}
                            contentContainerStyle={styles.beatGrid}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={false}
                        />
                    ) : (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {displayedData.map((item, index) => (
                                <View key={item.id || index} style={styles.squareItem}>
                                    <Image
                                        source={item.cover_image_url ? { uri: item.cover_image_url } : require('../../assets/images/UserProfile/defaultArtCover.png')}
                                        style={styles.squareImage}
                                    />
                                    <Text style={styles.title} numberOfLines={2}>{item.title || 'Untitled'}</Text>
                                    <Text style={styles.price}>${item.price || 'free'}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    )
                ) : type === 'albums' ? (
                    showAll[type] ? (
                        <FlatList
                            data={displayedData}
                            renderItem={renderAlbumItem}
                            keyExtractor={(item, index) => item.id || index.toString()}
                            numColumns={3}
                            contentContainerStyle={styles.albumGrid}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={false}
                        />
                    ) : (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {displayedData.map((album, index) => (
                                <View key={album.id || index} style={styles.albumItem}>
                                    <Image
                                        source={album.cover_image_url ? { uri: album.cover_image_url } : require('../../assets/images/UserProfile/defaultArtCover.png')}
                                        style={styles.albumImage}
                                    />
                                    <Text style={styles.albumTitle} numberOfLines={2}>{album.title || 'Untitled Album'}</Text>
                                    <Text style={styles.albumReleaseDate}>{handleGetYearFromDate(album.release_date)}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    )
                ) : (
                    <View>
                        {displayedData.map((item, index) =>
                            type === 'tracks' ? renderTrackItem({ item, index }) : null
                        )}
                    </View>
                )}
            </View>
        );
    };

    // SHOW TRACK ITEM UI
    const renderTrackItem = ({ item, index }) => (
        <TouchableOpacity
            key={item.track_id || index}
            style={[styles.trackItem, selectedItems.includes(item) && styles.selectedItem]}
            onPress={() => handleSelectItem('tracks', item)}
        >
            {selectedItems.includes(item) && (
                <View style={styles.checkTrackIconContainer}>
                    <Feather name="check" size={18} color="black" style={styles.checkIcon} />
                </View>
            )}
            <View style={styles.trackOrder}>
                <Text style={styles.trackCount}>{index + 1}</Text>
                <Image
                    source={
                        item.cover_image_url
                            ? { uri: item.cover_image_url }
                            : require('../../assets/images/UserProfile/defaultArtCover.png')
                    }
                    style={styles.trackImage}
                />
            </View>
            <View style={styles.trackInfo}>
                <Text style={styles.trackTitle}>{handleFormatText(item.title || 'Unknown', 26)}</Text>
                <Text style={styles.artist}>{handleFormatText(item.artist || name, 26)}</Text>
            </View>
            <Text style={styles.trackDuration}>{item.duration || '3:24'}</Text>
            <Image source={item.cover_image_url && require('../../assets/images/UserProfile/play.png')} style={styles.play} />
        </TouchableOpacity>
    );

    // SHOW ALBUM ITEM UI
    const renderAlbumItem = ({ item: album }) => (
        <TouchableOpacity
            key={album.album_id}
            style={[styles.albumGridItem, selectedItems.includes(album) && styles.selectedItem]}
            onPress={() => handleSelectItem('albums', album)}
        >
            {selectedItems.includes(album) && (
                <View style={styles.checkAlbumIconContainer}>
                    <Feather name="check" size={18} color="black" style={styles.checkIcon} />
                </View>
            )}
            <View style={styles.albumCoverContainer}>
                <Image
                    source={album.cover_image_url ? { uri: album.cover_image_url } : require('../../assets/images/UserProfile/defaultArtCover.png')}
                    style={styles.albumImage}
                />
            </View>
            <Text style={styles.albumTitle} numberOfLines={2}>{album.title || 'Untitled Album'}</Text>
            <Text style={styles.albumReleaseDate}>{handleGetYearFromDate(album.release_date)}</Text>
        </TouchableOpacity>
    );

    // SHOW BEAT ITEM UI
    const renderBeatItem = ({ item: beat }) => (
        <TouchableOpacity
            key={beat.title} // Use title as key if beat_id is missing
            style={[styles.gridItem, selectedItems.includes(beat) && styles.selectedItem]}
            onPress={() => handleSelectItem('beats', beat)}
        >
            {selectedItems.includes(beat) && (
                <View style={styles.checkIconContainer}>
                    <Feather name="check" size={18} color="black" style={styles.checkIcon} />
                </View>
            )}
            <View style={styles.squareCoverContainer}>
                <Image
                    source={beat.cover_image_url ? { uri: beat.cover_image_url } : require('../../assets/images/UserProfile/defaultArtCover.png')}
                    style={styles.dataImage}
                />
            </View>
            <Text style={styles.title} numberOfLines={2}>{beat.title || 'Untitled Beat'}</Text>
            <Text style={styles.price}>${beat.price || 'free'}</Text>
        </TouchableOpacity>
    );

    // SHOW SOUND ITEM UI
    const renderSoundItem = ({ item: sound }) => (
        <TouchableOpacity
            key={sound.sound_id}
            style={[styles.gridItem, selectedItems.includes(sound) && styles.selectedItem]}
            onPress={() => handleSelectItem('sounds', sound)}
        >
            {selectedItems.includes(sound) && (
                <View style={styles.checkIconContainer}>
                    <Feather name="check" size={18} color="black" style={styles.checkIcon} />
                </View>
            )}
            <View style={styles.squareCoverContainer}>
                <Image
                    source={sound.cover_image_url ? { uri: sound.cover_image_url } : require('../../assets/images/UserProfile/defaultArtCover.png')}
                    style={styles.dataImage}
                />
            </View>
            <Text style={styles.title} numberOfLines={2}>{sound.title || 'Untitled Beat'}</Text>
            <Text style={styles.price}>${sound.price || 'free'}</Text>
        </TouchableOpacity>
    );

    // SHOW PRESER ITEM UI
    const renderPresetItem = ({ item: preset }) => (
        <TouchableOpacity
            key={preset.preset_id}
            style={[styles.gridItem, selectedItems.includes(preset) && styles.selectedItem]}
            onPress={() => handleSelectItem('presets', preset)}
        >
            {selectedItems.includes(preset) && (
                <View style={styles.checkIconContainer}>
                    <Feather name="check" size={18} color="black" style={styles.checkIcon} />
                </View>
            )}
            <View style={styles.squareCoverContainer}>
                <Image
                    source={preset.cover_image_url ? { uri: preset.cover_image_url } : require('../../assets/images/UserProfile/defaultArtCover.png')}
                    style={styles.dataImage}
                />
            </View>
            <Text style={styles.title} numberOfLines={2}>{preset.title || 'Untitled Beat'}</Text>
            <Text style={styles.price}>${preset.price || 'free'}</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView
            style={styles.container}>
            {isAnyShowAllActive && (
                <View style={styles.searchContainer}>
                    <View style={styles.searchBox}>
                        <Feather name="search" color="#FFFFFF" size={22} style={{ paddingHorizontal: 10 }} />
                        <TextInput
                            placeholder={currentPlaceholder}
                            placeholderTextColor="#CECECE"
                            style={styles.searchInput}
                            value={searchText}
                            onChangeText={setSearchText}
                        />
                        {searchText.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchText('')} style={{ paddingHorizontal: 10 }}>
                                <FontAwesome6 name="times-circle" size={16} color="#FFFFFF" />
                            </TouchableOpacity>
                        )}
                    </View>
                    <TouchableOpacity onPress={handleCancelSearch}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            )}

            <Animated.View style={{ opacity }}>
                {renderItemsSection('tracks', tracks, 'Tracks')}
                {renderItemsSection('albums', albums, 'Albums')}
                {renderItemsSection('beats', beats, 'Beats')}
                {renderItemsSection('sounds', sounds, 'Sounds')}
                {renderItemsSection('presets', presets, 'Presets')}
                {renderDeleteModal()}
            </Animated.View>
            {isFetchingMore && (
                <View style={styles.loadingMoreContainer}>
                    <ActivityIndicator size="large" color={Colors.white} />
                </View>
            )}
        </ScrollView>
    );
};

export default Music;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#121212',
        justifyContent: 'center',
        alignItems: 'center',
    },
    section: {
        marginVertical: 5,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
        marginHorizontal: 24,
        marginVertical: 10,
    },
    searchBox: {
        flex: 1,
        backgroundColor: '#2A2A2A',
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        borderRadius: 10,
        height: 35,
    },
    searchInput: {
        color: 'white',
        paddingHorizontal: 10,
        fontSize: 15,
        flex: 1,
    },
    cancelText: {
        color: Colors.white,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '600',
        lineHeight: 20,
        marginLeft: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10,
        marginHorizontal: 13,
    },
    sectionTitle: {
        color: Colors.white,
        fontFamily: 'Open Sans',
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: 18,
        textTransform: 'uppercase',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 25,
        alignItems: 'center',
        justifyContent: 'center'
    },
    showAll: {
        color: Colors.white,
        fontFamily: 'Open Sans',
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: '800',
        lineHeight: 18,
        opacity: 0.7
    },
    editText: {
        color: Colors.white,
        marginLeft: 15,
        fontFamily: 'Open Sans',
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: '800',
        lineHeight: 18,
        opacity: 0.7
    },
    deleteText: {
        color: 'red',
        fontFamily: 'Open Sans',
        fontSize: 12,
        marginLeft: 15,
        fontStyle: 'normal',
        fontWeight: '800',
        lineHeight: 18,
        opacity: 0.7
    },
    cancelText: {
        color: Colors.white,
        fontFamily: 'Open Sans',
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: '800',
        lineHeight: 18,
        opacity: 0.7
    },
    exitText: {
        color: Colors.white,
        fontFamily: 'Open Sans',
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: '800',
        lineHeight: 18,
        opacity: 0.7
    },
    selectText: {
        color: Colors.white,
        fontSize: 12,
        textAlign: 'center',
    },
    selectedItem: {
        position: 'relative'
    },
    checkTrackIconContainer: {
        position: 'absolute',
        bottom: 40,
        left: 72,
        backgroundColor: Colors.themeColor,
        borderRadius: 12,
        padding: 4,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 30,
    },
    checkAlbumIconContainer: {
        position: 'absolute',
        top: 0,
        right: 16,
        backgroundColor: Colors.themeColor,
        borderRadius: 12,
        padding: 4,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    checkIconContainer: {
        position: 'absolute',
        top: 8,
        right: 22,
        backgroundColor: Colors.themeColor,
        borderRadius: 12,
        padding: 4,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    checkIcon: {
        color: Colors.white,
    },
    trackItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderRadius: 8,
        width: 368,
        height: 56,
        marginVertical: 8,
        marginHorizontal: 2,
    },
    trackOrder: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
    },
    disabledText: {
        color: Colors.white,
        opacity: 0.5,
    },
    trackCount: {
        color: '#F9F6EE',
    },
    trackImage: {
        width: 56,
        height: 56,
        resizeMode: 'cover',
    },
    borderTop: {
        borderWidth: 1,
        borderColor: '#2E3039',
        width: 343,
        marginHorizontal: 'auto',
    },
    borderBottom: {
        borderWidth: 0.5,
        borderColor: '#2E3039',
        width: 343,
        marginHorizontal: 'auto',
    },
    trackInfo: {
        flex: 1,
        marginLeft: 10,
    },
    trackTitle: {
        color: Colors.white,
        fontFamily: 'Open Sans',
        fontSize: 15,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 18,
    },
    artist: {
        color: Colors.white,
        fontFamily: "Open Sans",
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: 600,
        lineHeight: 14,
        opacity: 0.7,
    },
    trackDuration: {
        color: '#828796',
        textAlign: 'right',
        fontFamily: 'Open Sans',
        fontSize: 10,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 14,
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 30,
    },
    noDataText: {
        color: Colors.white,
        fontFamily: 'Open Sans',
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
    },
    notFoundContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 30,
    },
    notFound: {
        color: Colors.white,
        fontFamily: 'Open Sans',
        fontSize: 20,
        fontWeight: '800',
        textAlign: 'center',
    },
    notFoundQuery: {
        color: Colors.themeColor,
        fontFamily: 'Open Sans',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '800',
        marginVertical: 4,
    },
    notFoundQuerySmall: {
        color: Colors.white,
        fontFamily: 'Open Sans',
        fontSize: 12,
        textAlign: 'center',
        fontStyle: 'normal',
        fontWeight: '400',
        opacity: 0.7,
    },
    play: {
        position: 'absolute',
        top: 15,
        left: 56
    },
    asection: {
        paddingHorizontal: 16,
        paddingVertical: 10,
    },

    albumGrid: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    albumGridItem: {
        width: '30%',
        marginVertical: 10,
        marginHorizontal: 5.5,
        alignItems: 'center',
        padding: 4,
    },
    albumCoverContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    albumImage: {
        width: 150,
        height: 150,
        borderRadius: 80,
        marginHorizontal: 8,
    },
    titleYearContainer: {
        alignItems: 'center',
        marginTop: 4,
        width: '100%',
    },
    albumTitle: {
        color: Colors.white,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 4,
        marginHorizontal: 8,
        width: 150,
    },
    albumReleaseDate: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 12,
        opacity: 0.7,
        marginTop: 2,
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectedItem: {
        opacity: 0.6,
    },
    gridItem: {
        width: '45%',
        marginBottom: 16,
        marginHorizontal: 14,
    },
    squareCoverContainer: {
        width: 150,
        height: 150,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    squareItem: {
        width: 110,
        marginHorizontal: 18,
        marginRight: 28,
    },
    squareImage: {
        width: 130,
        height: 130,
        marginBottom: 5,
    },
    dataImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    title: {
        color: Colors.white,
        textAlign: 'left',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 4,
    },
    price: {
        color: Colors.white,
        fontSize: 14,
        marginTop: 4,
        fontWeight: '700',
        textAlign: 'left',
        opacity: 0.7
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalContent: {
        backgroundColor: '#1C1C1C',
        borderRadius: 14,
        padding: 20,
        width: 373,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    deleteImage: {
        width: 100,
        height: 100,
        margin: 'auto'
    },
    modalText: {
        color: '#FFF',
        textAlign: 'center',
        fontFamily: "Open Sans",
        fontSize: 20,
        fontStyle: 'normal',
        fontWeight: '700',
        marginTop: 10,
        lineHeight: 28,
    },
    modalTextDesc: {
        color: 'gray',
        textAlign: 'center',
        fontFamily: "Open Sans",
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: '400',
        marginTop: 10,
        marginBottom: 20,
    },
    buttonText: {
        color: Colors.white,
        fontWeight: '800'
    },
    cancelButton: {
        display: 'flex',
        paddingVertical: 15,
        width: 150,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        borderRadius: 24,
        backgroundColor: '#393939',
    },
    disabledDelete: {
        color: '#828796',
    },
    deleteButton: {
        display: 'flex',
        paddingVertical: 15,
        width: 150,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        borderRadius: 24,
        backgroundColor: '#FE3F56',
    },
});