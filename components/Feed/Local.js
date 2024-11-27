import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '../../constants/Color'
import { FontAwesome } from '@expo/vector-icons';

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

const events = [
    {
        id: 1,
        image: 'https://s3-alpha-sig.figma.com/img/a031/ef5a/8d42a1057d8b33ba4ee5a41acc5a2559?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=kz5acbVf9I0apcRPC0B2MG~nzfoopRwIGaCKsaLOekkoZEKLg1nf7p4TghcD8i01CHbuhpC6nkhGTmiJfZPmjvnl6MV~QuxyZdabR83Piv1-L9HQyE1TZYyhbb5bQFqgpc-wwBR0RySWxTlLBb95AnyAPC9URx1T9hO7Yy6UjcOyQ-8meLC8HF0-d~nW-RRe~y63bY1cytUaSdZbprI0i3vTeIm6qSftpUOQte69wURyXEseDvivhDcZHYFneXun8T~1rFsO7bH~a0E79QHqEoGEZQKFrTJIXdazFbEuG7NXJiZQO5tQjETJv-gf9YlREDV4WgSpa7K90eWxfNGnGg__',
        title: 'Throwback Thursday',
        location: 'Lincoln Theater, Washington DC',
        status: 'Happening Now',
        distance: '6 mi',
    },
    {
        id: 2,
        image: 'https://s3-alpha-sig.figma.com/img/a031/ef5a/8d42a1057d8b33ba4ee5a41acc5a2559?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=kz5acbVf9I0apcRPC0B2MG~nzfoopRwIGaCKsaLOekkoZEKLg1nf7p4TghcD8i01CHbuhpC6nkhGTmiJfZPmjvnl6MV~QuxyZdabR83Piv1-L9HQyE1TZYyhbb5bQFqgpc-wwBR0RySWxTlLBb95AnyAPC9URx1T9hO7Yy6UjcOyQ-8meLC8HF0-d~nW-RRe~y63bY1cytUaSdZbprI0i3vTeIm6qSftpUOQte69wURyXEseDvivhDcZHYFneXun8T~1rFsO7bH~a0E79QHqEoGEZQKFrTJIXdazFbEuG7NXJiZQO5tQjETJv-gf9YlREDV4WgSpa7K90eWxfNGnGg__',
        title: 'Throwback Thursday',
        location: 'Lincoln Theater, Washington DC',
        status: 'Happening Now',
        distance: '6 mi',
    },
]

const localArtists = [
    { id: 1, name: 'Eve J', genre: 'Jazz', image: 'https://s3-alpha-sig.figma.com/img/f5c8/6ee5/93d6e39aff14e17765d603c726f4d362?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=dWgvbHBuXTaWnIeAvdA9BVGmuajY0wI3UfkQi6t6vJm5q5zjjgOp6-N2Yfrq56dorUUtyfbIu1rbOVPCn~34nXEQ3-pzYaoKdJO0mcpMHGiU9giR6DG9u4qhHAC4geGgn3QFUzgQ6fVp99Yb3iJ~mjEARIjDKkS2SuHXNla7EV8IXyxbppYQM7mMxOev4JYt360j~lpweyoRNPA6pjv2H44f9ftLJ3WkzyY0gos3eG8~S2mtY9BtyroS5BKPAXWaxLMqwj6xwgGgH6xhKXB9-eGo8vtKQYhPSiiDW9Q~TArnKEc2MZQ-Y8SF7RVAU918~WlkONWMA8UcEF6~Yh6s7g__' },
    { id: 2, name: 'Andy Jo', genre: 'Pop', image: 'https://s3-alpha-sig.figma.com/img/3a99/40a0/a23905edd5b37359f5ce63fb81871a65?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=BDq7hHP2qVw~VSUulmUHCLvxArDK2jVWWIC-vokrAWklOg5zuB4QIggsnAeWxiKnhDzCDCn~LTLVwyn2BeyLPteoeW1LeInYmidrZ06I~aEhehOr5xT2bV7GdQzX0oPk5n8XokKVK8MFsiLaZ4oQFDnEzIr4l0pkwo0qlD53OZdaQikms3kkKHUjDE2Ke0jOhNZuNormw2KeSlGN3LJKSUNrvaH1RGrbCnaHD2Y7OnpWbAld~rXuXVJD0lP31ahdu~cPDohNPX-WHguY3sFQdWAy~9vrTgXAz0oY6j5gWuRJ7Wl-yaKTTSDkY3irDZDFjY1AoaQJXzzj-326MCo7PA__' },
    { id: 3, name: 'LaRose', genre: 'Jazz', image: 'https://s3-alpha-sig.figma.com/img/2d96/18ef/fd467c0026c0518551170473875fa686?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=YKwL3VM5erFHO4iiwoyCb-elED1UEJL3HhsvBz53GwW2oon-0gVbRmrEw1WQ4FDQB~YK3BE-cGHlsQifdnKxWLNloe~5sc4mb0v73I9GVgv4M7vqy8LEUGvSV4hx7-bO5qogGMAifISBZdbndmEvnMc6RciPUk8pqD2vtIO1S27GAHnOugPgkZoj0zmkNBhZSNQRNRy9uoDgJBVMR-ZzFSfXgqk8Ft3W7BNLsqwle7aufFEHupRKNS7ZpQl5As9yl~dJhJTytuOt8g4bOOz-TP7N7xBfZ3ASz0MGASh04cpxc4RUw~mlHDOm1nYfddEzB53TdlGsxaaACxq2hL888A__' },
    { id: 4, name: 'Joe', genre: 'Rock', image: 'https://s3-alpha-sig.figma.com/img/3a99/40a0/a23905edd5b37359f5ce63fb81871a65?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=BDq7hHP2qVw~VSUulmUHCLvxArDK2jVWWIC-vokrAWklOg5zuB4QIggsnAeWxiKnhDzCDCn~LTLVwyn2BeyLPteoeW1LeInYmidrZ06I~aEhehOr5xT2bV7GdQzX0oPk5n8XokKVK8MFsiLaZ4oQFDnEzIr4l0pkwo0qlD53OZdaQikms3kkKHUjDE2Ke0jOhNZuNormw2KeSlGN3LJKSUNrvaH1RGrbCnaHD2Y7OnpWbAld~rXuXVJD0lP31ahdu~cPDohNPX-WHguY3sFQdWAy~9vrTgXAz0oY6j5gWuRJ7Wl-yaKTTSDkY3irDZDFjY1AoaQJXzzj-326MCo7PA__' }
]

const Local = () => {
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                {/* Nearby Connections */}
                <View style={styles.nearbyContainer}>
                    <Text style={styles.nearbyText}>3 people linked with you nearby</Text>
                </View>

                {/* Local Events */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Local Events</Text>
                        <Text style={styles.showAll}>Show all</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                        {events.map(event => (
                            <View style={styles.eventCard} key={event.id}>
                                <Image source={{ uri: event.image }} style={styles.eventImage} />
                                <View style={styles.eventDetails}>
                                    <View style={styles.firstRow}>
                                        <Text style={styles.eventTitle}>{event.title}</Text>
                                        <Image
                                            source={require('../../assets/images/Feed/save.png')}
                                        />
                                    </View>
                                    <Text style={styles.eventLocation}>{event.location}</Text>
                                    <View style={styles.thirdRow}>
                                        <Text style={styles.eventStatus}>{event.status}</Text>
                                        <Text style={styles.eventDistance}>{event.distance}</Text>
                                    </View>
                                    <View style={styles.eventInfo}>
                                        <View style={styles.attendeeImages}>
                                            <Image source={{ uri: 'https://s3-alpha-sig.figma.com/img/75ca/9e5e/83100a467dabced9664b53fd3f6e5ac5?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Z9QvjqDgg5tI-JOhXUx9q15i6Bc50EakLZ8k3i82QSk3lPBS2vsHpVn65prXnGyWLa8W6Puyb89jwKuvFwFwZoY5zMsnyDAzoEL5sEtxxJRJeP~IVe59iLhvV3Dm9XP2lC~qqS9kJ9luW9nAeIzMMnR22zFygWOz62j769D0wrk~~PpRI0xzBNBtSMI4FrxEnz3GP998UZVjaYxk7xrd~rNuVzG~vaRp3fuY4gk3mHUTvGwSW0eyj3ZR~CMsJ9K08pz9ZbigrVfb4Ko-hotAgtYqs2D6Dpq93FnmxLbEc57521QNAa8MbG0OE10oR6RJEM03omiA6SXfXGJsCDBbrw__' }} style={[styles.attendeeImage, { left: 1 * 13, zIndex: 1 }]} />
                                            <Image source={{ uri: 'https://s3-alpha-sig.figma.com/img/6523/3ea8/b44fead1f569981d89b7885f46084c18?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=JAhE2qag3DrucLmIzYWNyb5eY8K2v~Mdkx2D2kL5b6qugblCa67NXhzQuy68aASD74tswoQTLUfIklX8AiFM4yQVjpQy9H4l2AtzwPoYiPmZxEPCB72jL55Wh0h9gOtQVBPaSi5Rj8uP1edXHLXAq7VRGKwh4okRlSgNENf0OIPHBVyn2Oy737AvV05QUxF14Iq-q1i2YilxLKkv4tIV6TqSIF6bbp7OXUaMZqJztZKm9oH-yn2NP38uqeloUFx-60KGJVmLqumBQiy2qk1tItdLc0oTXpZdkaO1ZyLvTtRm3PM6-iMYMbQOigFAHHqBggpex3eXl0V1AfsoL0KgZw__' }} style={[styles.attendeeImage, { left: 2 * 18, zIndex: 2 }]} />
                                            <Image source={{ uri: 'https://s3-alpha-sig.figma.com/img/7845/b148/56b97fe4798643ee24d769e833e105ac?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=YPKrhSb-QsbUrY1r8~-E6QEePNcerLP~AsJAsOOWM4Pb02VweCMZJruP2PjBnScSME772c3dtxWfmE6vdc4B~TyoJfW43vic5C6cpsIwPxx5tIFTuJjZDFF3EpxsfKvjZnyigHkM5yX-6DM~DCU45FR4OeRFUK~7qQGCRy91dmpbGucw876IXl6HdE6GbcoLbxLs8a5az2ywaHZuqV8m8zEf~5axLH8LIuUCST5ZFxoYAuPdNvLDrfmzoq4nUYK8sGAV--kHbMlvTEvH-IHJmtOzPTbqUBDr2OqbX5C2f~pM1nW3gMVT3GvY3GiNdesUHpfFy2vgqQ0Ci2KjQnOCog__' }} style={[styles.attendeeImage, { left: 3 * 20, zIndex: 3 }]} />
                                        </View>
                                        <TouchableOpacity style={styles.detailsButton}>
                                            <Text style={styles.detailsButtonText}>Details</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
                {/* Local Rising Artists */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Local rising artist</Text>
                        <Text style={styles.showAll}>Show All</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                        <View style={styles.artistList}>
                            {localArtists.map(artist => (
                                <View key={artist.id} style={styles.artistCard}>
                                    <Image source={{ uri: artist.image }} style={styles.artistImage} />
                                    <Text style={styles.artistName}>{artist.name}</Text>
                                    <Text style={styles.artistGenre}>{artist.genre}</Text>
                                    <TouchableOpacity style={styles.profileButton}>
                                        <Text style={styles.profileButtonText}>view profile</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* Pupular groups */}
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
            </View>
        </ScrollView >
    )
}

export default Local

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    nearbyContainer: {
        backgroundColor: '#121212',
        borderColor: '#00FD61',
        borderWidth: 1,
        borderRadius: 10,
        width: 343,
        height: 43,
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 16
    },
    nearbyText: {
        color: '#00FD61',
        textAlign: 'center',
        fontFamily: "Open Sans",
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: 18,
        textTransform: 'uppercase',
    },
    section: {
        marginBottom: 20
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    sectionTitle: {
        color: Colors.white,
        textAlign: 'center',
        fontFamily: "Open Sans",
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 20,
    },
    showAll: {
        color: Colors.white,
        textAlign: 'center',
        fontFamily: "Open Sans",
        fontSize: 10,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 14,
        opacity: 0.7
    },
    eventCard: {
        backgroundColor: '#22252F',
        borderRadius: 10,
        width: 343,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    eventImage: {
        width: 86,
        height: 98,
        marginRight: 12
    },
    eventDetails: {
        flex: 1,
    },
    firstRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    thirdRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    eventTitle: {
        color: Colors.white,
        textAlign: 'center',
        fontFamily: "Open Sans",
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: 20,
    },
    eventLocation: {
        color: Colors.white,
        fontFamily: "Open Sans",
        fontSize: 10,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 14,
        opacity: 0.8
    },
    eventStatus: {
        color: '#59A310',
        textAlign: 'center',
        fontFamily: "Open Sans",
        fontSize: 10,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 14,
    },
    eventInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8
    },
    attendeeImages: {
        flexDirection: 'row',
        marginRight: 8
    },
    attendeeImage: {
        width: 29,
        height: 29,
        borderRadius: 20,
        position: 'absolute',
        top: -14,
    },
    eventDistance: {
        color: '#828796',
        fontFamily: 'Inter',
        fontSize: 10,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 14,
    },
    detailsButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 4,
        paddingHorizontal: 24,
        borderRadius: 4,
    },
    detailsButtonText: {
        color: Colors.white,
        fontFamily: 'Inter',
        fontSize: 13,
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: 20,
    },
    artistList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    artistCard: {
        width: 110,
        height: 164,
        alignItems: 'center',
        backgroundColor: '#22252F',
        borderRadius: 10,
        paddingVertical: 10,
        marginRight: 14,
    },
    artistImage: {
        width: 69,
        height: 69,
        borderRadius: 71,
        marginBottom: 8
    },
    artistName: {
        color: Colors.white,
        textAlign: 'center',
        fontFamily: 'Poppins',
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: '500',
        lineHeight: 18,
    },
    artistGenre: {
        color: '#7F7F7F',
        textAlign: 'center',
        fontFamily: 'Poppins',
        fontSize: 10,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 14,
    },
    profileButton: {
        backgroundColor: Colors.primary,
        borderRadius: 14,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginTop: 8,
    },
    profileButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold'
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
    profileButton: {
        backgroundColor: Colors.primary,
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginTop: 8,
    },
    profileButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
})