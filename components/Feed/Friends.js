import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
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
        status: '23 friends are going',
        distance: '6 mi',
    },
    {
        id: 2,
        image: 'https://s3-alpha-sig.figma.com/img/a031/ef5a/8d42a1057d8b33ba4ee5a41acc5a2559?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=kz5acbVf9I0apcRPC0B2MG~nzfoopRwIGaCKsaLOekkoZEKLg1nf7p4TghcD8i01CHbuhpC6nkhGTmiJfZPmjvnl6MV~QuxyZdabR83Piv1-L9HQyE1TZYyhbb5bQFqgpc-wwBR0RySWxTlLBb95AnyAPC9URx1T9hO7Yy6UjcOyQ-8meLC8HF0-d~nW-RRe~y63bY1cytUaSdZbprI0i3vTeIm6qSftpUOQte69wURyXEseDvivhDcZHYFneXun8T~1rFsO7bH~a0E79QHqEoGEZQKFrTJIXdazFbEuG7NXJiZQO5tQjETJv-gf9YlREDV4WgSpa7K90eWxfNGnGg__',
        title: 'Throwback Thursday',
        location: 'Lincoln Theater, Washington DC',
        status: '78 friends are going',
        distance: '6 mi',
    },
];
const people = [
    { id: 1, name: 'Jordan', handle: '@Hjordan', image: 'https://s3-alpha-sig.figma.com/img/6cf9/6f29/1f6b979b6c1bbe64b85b827220f3d305?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=WH1flkqYeYUcCtbL2d48Yjb39psP5tsnJzGYDMbvAquDc0C2lBYI8BmwVTxrBAalt8r-sQID0IU3tC1Hd8v7yJwD02TJU13Dh88pwYzDYOGybhLBzY5Z8Ym8edlBRnjRYe8OahwF-9wZiOO7LQjHqFw-1N8wTwXruBcNA1grUch7xYKJY5wMbkAV9oq~-pXzWEKGVvl10FGrwKwiG~ZD8mbZb8NbZRzoMxIRoI9mk9SMnrYkhSMq4oFkCp91kdKk9lE0fUg1gO1a-6vqIUZPA0qpmhnpgxUuA1FDRujN80e1qjTMkSD6CI6~n7hPVhKe149trh93kbewTqLyWOXYhw__' },
    { id: 2, name: 'Zaynab', handle: '@BanaZ', image: 'https://s3-alpha-sig.figma.com/img/635b/6cf4/f030ceea34efd0418d4b2020b1f0d087?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Rn3xf1yg5CJMwFLI1TaqsyVTaTKTZ4TWT8M5ZGg6AMsah8uK~bZMsR5iekCzOMrvbdowS~~fRcxfq3jdustJqhZloZDKPfL1cpi~TAcfTwODwHt6EKTgnQ0LRh28xgHKYQle1cN2095hyXvB8rsFy2H~5nNXRw9TGY7-OCXfgi8ISQHEY6~Z0pu4Vru4CLXqPAfW4iwYAqyg1QRI1JXvwg27njfbvlGcL4beQy2c-F8o754Djpy9iSTXuCcscw3RAEp74e6PXVYEkVVBmBBpCON1EeVSWdX8CK4gVcf4Z6d3z5Q7MjW~otnJgipoNUlAV80ihql3~U1AWdVgFw6BtA__' },
    { id: 3, name: 'Ashley', handle: '@AshBash', image: 'https://s3-alpha-sig.figma.com/img/d1dc/3552/078da04bb5f21d0d4fb1a0bed9b06608?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=njdeCgBpmCGLpG2ayvKcMP3vjgdZVl3z0IrIG2WnPHDsCDrzJLT73zJDbfn8VcG662AY8mFAr5KRFnKkfG9C1QB4MGmJr5GG-0fYLIbhzWrRcLVYPU7Zswc~Z781ZNdwdrcMz4IlvMKkNqC8og5GmgICJ7vZh5xiPTtISoYAdCnvGFBRQy~qaHMTuI6ibFkV4g8nOW0Uvxv-6Zv5dyViLdt~JJJh14b6-v3vp65JAE4tNVZuLfb0feg8jQG1Z8t1wDweLQjnUL-~a0rwk8UKDtdlgCb1alGKybi8Jx~HZfX6pHpcmaHX85mXa2Xn4xvPV9AKyawWa-JSTAta9u0JXw__' },
    { id: 4, name: 'Ashley', handle: '@AshBash', image: 'https://s3-alpha-sig.figma.com/img/d1dc/3552/078da04bb5f21d0d4fb1a0bed9b06608?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=njdeCgBpmCGLpG2ayvKcMP3vjgdZVl3z0IrIG2WnPHDsCDrzJLT73zJDbfn8VcG662AY8mFAr5KRFnKkfG9C1QB4MGmJr5GG-0fYLIbhzWrRcLVYPU7Zswc~Z781ZNdwdrcMz4IlvMKkNqC8og5GmgICJ7vZh5xiPTtISoYAdCnvGFBRQy~qaHMTuI6ibFkV4g8nOW0Uvxv-6Zv5dyViLdt~JJJh14b6-v3vp65JAE4tNVZuLfb0feg8jQG1Z8t1wDweLQjnUL-~a0rwk8UKDtdlgCb1alGKybi8Jx~HZfX6pHpcmaHX85mXa2Xn4xvPV9AKyawWa-JSTAta9u0JXw__' }
];
const posts = [
    {
        id: 1,
        profileImage: 'https://s3-alpha-sig.figma.com/img/718a/997d/6aa1054cd6990a077c37b8832d62d15b?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=EWsvigxqgByFgwFY2fRbrUcil4DyQP3k7m9BLpF-JXN7CDfWvOsZgswb5BL5LsjG9jEBh8z2mI0nccEsQSU5ecaIeh0b8k1E1QgjFUojKTDV~wZVbqLchUVjdN-Z~6m7OXOFz~FMnQp8JfW9Naq9I7ORUziPxc~oMQ5DIGLYQxieyobS6dKOOGdWapjPEJ7f4eXsGSXGXlBhkceAIiAFqd7PTPQ4MjHlz4TiTtX7qE~ackzkY8WqHglLlU0LnNy9gcppRGOr0cC~HZI2zs83YcnJngsnIihhs5B4OO-i4jUyq~Wds81XhpEcn77vC1UEUBV0AmcQd9in5P3Q5~VWhQ__',
        author: 'Ray Simmon',
        time: '6h ago',
        online: false,
        content: 'Anybody going to silent disco tonight? Looking to meet new friends. ',
        contentImage: null,
        likeCount: 30,
        commentCount: 65,
        shareCount: 11,
    },
    {
        id: 2,
        profileImage: 'https://s3-alpha-sig.figma.com/img/d828/ea0b/2b2446ec17fd510c8126e76cd7de76d0?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=pF3kgB0ce61bkdgaVNGXFScpO2d36jIAejTORIeJgc475MYK3u-3JVxisRZGkKTBZaWBh2HiWzhe7XW6M7SfUP-R2xvsDwNjR-4oimsko7eGC4mQI2vyySJYwGDtggeTIrDalGwx0h8WBX-xqvkKwPlBEpAmxeh3fCGShr-cWAq9UtBaUlFc~5BGODCuuzAdRzZupd9zX03GqGgqpdA4fdmkJQOGBqnOhYGGX7T4AFpbqjA5uwdxteSRbUtalw2Rq~qtRstyD00W1Dz6HmC1Z4uDi9rUrnjrUT2uugbJnK84Lf9snJMQiEURRuTT1DJagAOyr6fJ~YoFcrSMPIzCXg__',
        author: 'Andy Loo',
        online: true,
        time: '1d ago',
        content: 'Felt like a kid again! @TheBallPitDC',
        contentImage: 'https://s3-alpha-sig.figma.com/img/367a/4b9b/63398de78f27312b26691d270690139f?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=DQZUStEQsNry8LSL8F3rXva4riLVCl56ElzsU2-2OHu8lCqW-M1jtNLUfQSRRrhvE9kDaRJYGPRIadXAUOzTSl8YtvOmyWh55Gpwm7X2FjrWyIKsPRpyzimVHGP6udAlHzHd16y0K6f495ushJmdxWk-Y1qVnfbnOkFwvoyIt9V57w1GBZIbFkmtGn2o7mWuHUjrjixqqQOt86mKHPOjJ1H4ah9XhkO4yuR1~8LPi-SbsvirEjwSdkTn9EHUEBtgpgB0horjRm4IIblUF6q8B84Y0Mty78PmkCal2UScyDJ4dTtmeT4rftmKQCU5JkfUP7gjv-syAowvgTq45ZhIyg__',
        likeCount: 120,
        commentCount: 40,
        shareCount: 15,
    }
];

const Friends = () => {
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
                {/* Local Events */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Discover events friends are attending</Text>
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

                {/* Local Rising Artists */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>People you may know</Text>
                        <Text style={styles.showAll}>Show All</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                        <View style={styles.artistList}>
                            {people.map(person => (
                                <View key={person.id} style={styles.artistCard}>
                                    <Image source={{ uri: person.image }} style={styles.artistImage} />
                                    <Text style={styles.artistName}>{person.name}</Text>
                                    <Text style={styles.artistGenre}>{person.handle}</Text>
                                    <TouchableOpacity style={styles.profileButton}>
                                        <Text style={styles.profileButtonText}>Add friend</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* Post  */}
                <View>
                    {posts.map((post, index) => (
                        <View key={post.id} style={styles.postContainer}>
                            <View style={styles.header}>
                                <View style={styles.profileContainer}>
                                    <Image source={{ uri: post.profileImage }} style={styles.profileImage} />
                                    {post.online && <View style={styles.onlineIndicator} />}
                                </View>
                                <View style={styles.headerText}>
                                    <Text style={styles.postAuthor}>{post.author}</Text>
                                    <Text style={styles.postTime}>{post.time}</Text>
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
        </ScrollView >
    )
}

export default Friends

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    section: {
        marginBottom: 20
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    postContainer: {
        backgroundColor: '#22252F',
        borderRadius: 12,
        paddingVertical: 20,
        paddingHorizontal: 10,
        marginBottom: 10,
        position: 'relative',
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 0,
        right: 10,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#00FF00',
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
    postAuthor: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    postTime: {
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
})