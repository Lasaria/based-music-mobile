import { Image, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import React, { useState } from 'react';
import { Colors } from '../../constants/Color';

const events = [
    {
        id: 1, date: '2024-11-10', city: 'Washington, DC', venue: 'Revolution Live', time: 'Fri, 7 PM', attendees: 447,
        attendeesCover: [
            'https://s3-alpha-sig.figma.com/img/9253/cfb9/9b8a861f94614d0a8958ffb8d1ad5f1d?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=lqzCHqYxC4KIv6YpayGX2ktMb3VtVV50lONX3kRjfpf9-w~9Jybjtgf33s3-5V0Kxf1frsXwK52~F0XrLxWXuUx-Rz0kDxjBy8BgdvTLifTJqW~Frxo1ctToQ-XefQjOdGoLCXH-8My97X~1QC9enima5A29KQxZDziGnh2N3CQfbbTEItvFNBzQ~9BZvxyBsXVqROH7xq0s1bCPpB004JOqXsWFdoUsJ-YmYdS3nsSzq87tPFocM2c9sM2MoweRFBpCGrRGJgPV0IMpdtMWvNAb0xT0EJw~Z3RMOjO8RBXJbk1BplUZI4~2YIsolmTJN0JrhG0Ku3Va5pT6OXpPIg__',
            'https://s3-alpha-sig.figma.com/img/c55d/ef94/e44e69d5bb8503477a7eca59e753bffa?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=I2fCD1dVPDI1k0k1QlLtfIITI7sfkqxVfbBwLf5tRgMDzgkquF2QJ9mijEsclFrsrl6V5fsn0aPatkzGLEJJeFcBrVUSd12irDVBYWlV6HbMeuCB5gmlLWvg188wdRHwIkS7lPgC73ZiPHMrPCKseEoM1jWFG95AaJwELGg2I~9JCOpNOUKwIHVj0jOptJyUmkESPWG-9bv76-0pP0vDdZs-qMQ7KI9HYskgguDJl9uS3M7x3xx9jQC5J1VPOPj3yO1-WM8TTzXDRLtP6oOR2jKaFUPsRYYrClPXHHZl0bIiUW3YRAnIr-ST~rJ2GYFsDiWzgt0no-3reVwswwziag__',
            'https://s3-alpha-sig.figma.com/img/8b25/f292/89e88889188d07ef9624cbc063aa7fc2?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LBjyKBJsWjzd63vpMvGhRr6ELqZVgErnPwNdY0cLc8UC7QxOJ9fDPEDdks5v5DclJ~L5DO8G6lAv42EjEjmn7D1ZhrFTOQPAmg62C2Jnxy5GdCTfekEqEEB2NC2NIuD-n2HTsMWl7ZZJiQxoYl75wy4jEOK7mBLaAd9Mm86NunIvaotMFJ66-NIwSsAe3Fmd1A-sUwteGJ8NYatDmxZeo66FiIU-Xk151QcHmq9vyps1hzIqfiUHR7dYhHmXsPIEEXU3wCmlYYBLqBp7wh02OtMvHD0GGo9283ntv9V4vkg04ioVBcJXxb1yH8rRvdy23UXmo3oWqA2WewOWqQTTCw__',
        ],
    },
    {
        id: 2, date: '2024-11-15', city: 'Arlington', venue: 'Friday Night Live', time: 'Fri, 7 PM', attendees: 447,
        attendeesCover: [
            'https://s3-alpha-sig.figma.com/img/9253/cfb9/9b8a861f94614d0a8958ffb8d1ad5f1d?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=lqzCHqYxC4KIv6YpayGX2ktMb3VtVV50lONX3kRjfpf9-w~9Jybjtgf33s3-5V0Kxf1frsXwK52~F0XrLxWXuUx-Rz0kDxjBy8BgdvTLifTJqW~Frxo1ctToQ-XefQjOdGoLCXH-8My97X~1QC9enima5A29KQxZDziGnh2N3CQfbbTEItvFNBzQ~9BZvxyBsXVqROH7xq0s1bCPpB004JOqXsWFdoUsJ-YmYdS3nsSzq87tPFocM2c9sM2MoweRFBpCGrRGJgPV0IMpdtMWvNAb0xT0EJw~Z3RMOjO8RBXJbk1BplUZI4~2YIsolmTJN0JrhG0Ku3Va5pT6OXpPIg__',
            'https://s3-alpha-sig.figma.com/img/c55d/ef94/e44e69d5bb8503477a7eca59e753bffa?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=I2fCD1dVPDI1k0k1QlLtfIITI7sfkqxVfbBwLf5tRgMDzgkquF2QJ9mijEsclFrsrl6V5fsn0aPatkzGLEJJeFcBrVUSd12irDVBYWlV6HbMeuCB5gmlLWvg188wdRHwIkS7lPgC73ZiPHMrPCKseEoM1jWFG95AaJwELGg2I~9JCOpNOUKwIHVj0jOptJyUmkESPWG-9bv76-0pP0vDdZs-qMQ7KI9HYskgguDJl9uS3M7x3xx9jQC5J1VPOPj3yO1-WM8TTzXDRLtP6oOR2jKaFUPsRYYrClPXHHZl0bIiUW3YRAnIr-ST~rJ2GYFsDiWzgt0no-3reVwswwziag__',
            'https://s3-alpha-sig.figma.com/img/8b25/f292/89e88889188d07ef9624cbc063aa7fc2?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LBjyKBJsWjzd63vpMvGhRr6ELqZVgErnPwNdY0cLc8UC7QxOJ9fDPEDdks5v5DclJ~L5DO8G6lAv42EjEjmn7D1ZhrFTOQPAmg62C2Jnxy5GdCTfekEqEEB2NC2NIuD-n2HTsMWl7ZZJiQxoYl75wy4jEOK7mBLaAd9Mm86NunIvaotMFJ66-NIwSsAe3Fmd1A-sUwteGJ8NYatDmxZeo66FiIU-Xk151QcHmq9vyps1hzIqfiUHR7dYhHmXsPIEEXU3wCmlYYBLqBp7wh02OtMvHD0GGo9283ntv9V4vkg04ioVBcJXxb1yH8rRvdy23UXmo3oWqA2WewOWqQTTCw__',
        ],
    },
    {
        id: 3, date: '2024-11-20', city: 'Arlington', venue: 'Silent Disco', time: 'Fri, 7 PM', attendees: 447,
        attendeesCover: [
            'https://s3-alpha-sig.figma.com/img/9253/cfb9/9b8a861f94614d0a8958ffb8d1ad5f1d?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=lqzCHqYxC4KIv6YpayGX2ktMb3VtVV50lONX3kRjfpf9-w~9Jybjtgf33s3-5V0Kxf1frsXwK52~F0XrLxWXuUx-Rz0kDxjBy8BgdvTLifTJqW~Frxo1ctToQ-XefQjOdGoLCXH-8My97X~1QC9enima5A29KQxZDziGnh2N3CQfbbTEItvFNBzQ~9BZvxyBsXVqROH7xq0s1bCPpB004JOqXsWFdoUsJ-YmYdS3nsSzq87tPFocM2c9sM2MoweRFBpCGrRGJgPV0IMpdtMWvNAb0xT0EJw~Z3RMOjO8RBXJbk1BplUZI4~2YIsolmTJN0JrhG0Ku3Va5pT6OXpPIg__',
            'https://s3-alpha-sig.figma.com/img/c55d/ef94/e44e69d5bb8503477a7eca59e753bffa?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=I2fCD1dVPDI1k0k1QlLtfIITI7sfkqxVfbBwLf5tRgMDzgkquF2QJ9mijEsclFrsrl6V5fsn0aPatkzGLEJJeFcBrVUSd12irDVBYWlV6HbMeuCB5gmlLWvg188wdRHwIkS7lPgC73ZiPHMrPCKseEoM1jWFG95AaJwELGg2I~9JCOpNOUKwIHVj0jOptJyUmkESPWG-9bv76-0pP0vDdZs-qMQ7KI9HYskgguDJl9uS3M7x3xx9jQC5J1VPOPj3yO1-WM8TTzXDRLtP6oOR2jKaFUPsRYYrClPXHHZl0bIiUW3YRAnIr-ST~rJ2GYFsDiWzgt0no-3reVwswwziag__',
            'https://s3-alpha-sig.figma.com/img/8b25/f292/89e88889188d07ef9624cbc063aa7fc2?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LBjyKBJsWjzd63vpMvGhRr6ELqZVgErnPwNdY0cLc8UC7QxOJ9fDPEDdks5v5DclJ~L5DO8G6lAv42EjEjmn7D1ZhrFTOQPAmg62C2Jnxy5GdCTfekEqEEB2NC2NIuD-n2HTsMWl7ZZJiQxoYl75wy4jEOK7mBLaAd9Mm86NunIvaotMFJ66-NIwSsAe3Fmd1A-sUwteGJ8NYatDmxZeo66FiIU-Xk151QcHmq9vyps1hzIqfiUHR7dYhHmXsPIEEXU3wCmlYYBLqBp7wh02OtMvHD0GGo9283ntv9V4vkg04ioVBcJXxb1yH8rRvdy23UXmo3oWqA2WewOWqQTTCw__',
        ],
    },
    {
        id: 4, date: '2024-11-25', city: 'Arlington', venue: 'Winter Fest', time: 'Fri, 7 PM', attendees: 447,
        attendeesCover: [
            'https://s3-alpha-sig.figma.com/img/9253/cfb9/9b8a861f94614d0a8958ffb8d1ad5f1d?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=lqzCHqYxC4KIv6YpayGX2ktMb3VtVV50lONX3kRjfpf9-w~9Jybjtgf33s3-5V0Kxf1frsXwK52~F0XrLxWXuUx-Rz0kDxjBy8BgdvTLifTJqW~Frxo1ctToQ-XefQjOdGoLCXH-8My97X~1QC9enima5A29KQxZDziGnh2N3CQfbbTEItvFNBzQ~9BZvxyBsXVqROH7xq0s1bCPpB004JOqXsWFdoUsJ-YmYdS3nsSzq87tPFocM2c9sM2MoweRFBpCGrRGJgPV0IMpdtMWvNAb0xT0EJw~Z3RMOjO8RBXJbk1BplUZI4~2YIsolmTJN0JrhG0Ku3Va5pT6OXpPIg__',
            'https://s3-alpha-sig.figma.com/img/c55d/ef94/e44e69d5bb8503477a7eca59e753bffa?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=I2fCD1dVPDI1k0k1QlLtfIITI7sfkqxVfbBwLf5tRgMDzgkquF2QJ9mijEsclFrsrl6V5fsn0aPatkzGLEJJeFcBrVUSd12irDVBYWlV6HbMeuCB5gmlLWvg188wdRHwIkS7lPgC73ZiPHMrPCKseEoM1jWFG95AaJwELGg2I~9JCOpNOUKwIHVj0jOptJyUmkESPWG-9bv76-0pP0vDdZs-qMQ7KI9HYskgguDJl9uS3M7x3xx9jQC5J1VPOPj3yO1-WM8TTzXDRLtP6oOR2jKaFUPsRYYrClPXHHZl0bIiUW3YRAnIr-ST~rJ2GYFsDiWzgt0no-3reVwswwziag__',
            'https://s3-alpha-sig.figma.com/img/8b25/f292/89e88889188d07ef9624cbc063aa7fc2?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LBjyKBJsWjzd63vpMvGhRr6ELqZVgErnPwNdY0cLc8UC7QxOJ9fDPEDdks5v5DclJ~L5DO8G6lAv42EjEjmn7D1ZhrFTOQPAmg62C2Jnxy5GdCTfekEqEEB2NC2NIuD-n2HTsMWl7ZZJiQxoYl75wy4jEOK7mBLaAd9Mm86NunIvaotMFJ66-NIwSsAe3Fmd1A-sUwteGJ8NYatDmxZeo66FiIU-Xk151QcHmq9vyps1hzIqfiUHR7dYhHmXsPIEEXU3wCmlYYBLqBp7wh02OtMvHD0GGo9283ntv9V4vkg04ioVBcJXxb1yH8rRvdy23UXmo3oWqA2WewOWqQTTCw__',
        ],
    },
    {
        id: 5, date: '2024-09-18', city: 'Washington, DC', venue: 'Fall and Leaves Live', time: 'Fri, 7 PM', attendees: 447,
        attendeesCover: [
            'https://s3-alpha-sig.figma.com/img/9253/cfb9/9b8a861f94614d0a8958ffb8d1ad5f1d?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=lqzCHqYxC4KIv6YpayGX2ktMb3VtVV50lONX3kRjfpf9-w~9Jybjtgf33s3-5V0Kxf1frsXwK52~F0XrLxWXuUx-Rz0kDxjBy8BgdvTLifTJqW~Frxo1ctToQ-XefQjOdGoLCXH-8My97X~1QC9enima5A29KQxZDziGnh2N3CQfbbTEItvFNBzQ~9BZvxyBsXVqROH7xq0s1bCPpB004JOqXsWFdoUsJ-YmYdS3nsSzq87tPFocM2c9sM2MoweRFBpCGrRGJgPV0IMpdtMWvNAb0xT0EJw~Z3RMOjO8RBXJbk1BplUZI4~2YIsolmTJN0JrhG0Ku3Va5pT6OXpPIg__',
            'https://s3-alpha-sig.figma.com/img/c55d/ef94/e44e69d5bb8503477a7eca59e753bffa?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=I2fCD1dVPDI1k0k1QlLtfIITI7sfkqxVfbBwLf5tRgMDzgkquF2QJ9mijEsclFrsrl6V5fsn0aPatkzGLEJJeFcBrVUSd12irDVBYWlV6HbMeuCB5gmlLWvg188wdRHwIkS7lPgC73ZiPHMrPCKseEoM1jWFG95AaJwELGg2I~9JCOpNOUKwIHVj0jOptJyUmkESPWG-9bv76-0pP0vDdZs-qMQ7KI9HYskgguDJl9uS3M7x3xx9jQC5J1VPOPj3yO1-WM8TTzXDRLtP6oOR2jKaFUPsRYYrClPXHHZl0bIiUW3YRAnIr-ST~rJ2GYFsDiWzgt0no-3reVwswwziag__',
            'https://s3-alpha-sig.figma.com/img/8b25/f292/89e88889188d07ef9624cbc063aa7fc2?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LBjyKBJsWjzd63vpMvGhRr6ELqZVgErnPwNdY0cLc8UC7QxOJ9fDPEDdks5v5DclJ~L5DO8G6lAv42EjEjmn7D1ZhrFTOQPAmg62C2Jnxy5GdCTfekEqEEB2NC2NIuD-n2HTsMWl7ZZJiQxoYl75wy4jEOK7mBLaAd9Mm86NunIvaotMFJ66-NIwSsAe3Fmd1A-sUwteGJ8NYatDmxZeo66FiIU-Xk151QcHmq9vyps1hzIqfiUHR7dYhHmXsPIEEXU3wCmlYYBLqBp7wh02OtMvHD0GGo9283ntv9V4vkg04ioVBcJXxb1yH8rRvdy23UXmo3oWqA2WewOWqQTTCw__',
        ],
    },
    {
        id: 6, date: '2024-08-14', city: 'Arlington', venue: 'SumFest', time: 'Fri, 7 PM', attendees: 447,
        attendeesCover: [
            'https://s3-alpha-sig.figma.com/img/9253/cfb9/9b8a861f94614d0a8958ffb8d1ad5f1d?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=lqzCHqYxC4KIv6YpayGX2ktMb3VtVV50lONX3kRjfpf9-w~9Jybjtgf33s3-5V0Kxf1frsXwK52~F0XrLxWXuUx-Rz0kDxjBy8BgdvTLifTJqW~Frxo1ctToQ-XefQjOdGoLCXH-8My97X~1QC9enima5A29KQxZDziGnh2N3CQfbbTEItvFNBzQ~9BZvxyBsXVqROH7xq0s1bCPpB004JOqXsWFdoUsJ-YmYdS3nsSzq87tPFocM2c9sM2MoweRFBpCGrRGJgPV0IMpdtMWvNAb0xT0EJw~Z3RMOjO8RBXJbk1BplUZI4~2YIsolmTJN0JrhG0Ku3Va5pT6OXpPIg__',
            'https://s3-alpha-sig.figma.com/img/c55d/ef94/e44e69d5bb8503477a7eca59e753bffa?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=I2fCD1dVPDI1k0k1QlLtfIITI7sfkqxVfbBwLf5tRgMDzgkquF2QJ9mijEsclFrsrl6V5fsn0aPatkzGLEJJeFcBrVUSd12irDVBYWlV6HbMeuCB5gmlLWvg188wdRHwIkS7lPgC73ZiPHMrPCKseEoM1jWFG95AaJwELGg2I~9JCOpNOUKwIHVj0jOptJyUmkESPWG-9bv76-0pP0vDdZs-qMQ7KI9HYskgguDJl9uS3M7x3xx9jQC5J1VPOPj3yO1-WM8TTzXDRLtP6oOR2jKaFUPsRYYrClPXHHZl0bIiUW3YRAnIr-ST~rJ2GYFsDiWzgt0no-3reVwswwziag__',
            'https://s3-alpha-sig.figma.com/img/8b25/f292/89e88889188d07ef9624cbc063aa7fc2?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LBjyKBJsWjzd63vpMvGhRr6ELqZVgErnPwNdY0cLc8UC7QxOJ9fDPEDdks5v5DclJ~L5DO8G6lAv42EjEjmn7D1ZhrFTOQPAmg62C2Jnxy5GdCTfekEqEEB2NC2NIuD-n2HTsMWl7ZZJiQxoYl75wy4jEOK7mBLaAd9Mm86NunIvaotMFJ66-NIwSsAe3Fmd1A-sUwteGJ8NYatDmxZeo66FiIU-Xk151QcHmq9vyps1hzIqfiUHR7dYhHmXsPIEEXU3wCmlYYBLqBp7wh02OtMvHD0GGo9283ntv9V4vkg04ioVBcJXxb1yH8rRvdy23UXmo3oWqA2WewOWqQTTCw__',
        ],
    },
    {
        id: 7, date: '2024-07-23', city: 'Arlington', venue: 'SpringFest', time: 'Fri, 7 PM', attendees: 447,
        attendeesCover: [
            'https://s3-alpha-sig.figma.com/img/9253/cfb9/9b8a861f94614d0a8958ffb8d1ad5f1d?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=lqzCHqYxC4KIv6YpayGX2ktMb3VtVV50lONX3kRjfpf9-w~9Jybjtgf33s3-5V0Kxf1frsXwK52~F0XrLxWXuUx-Rz0kDxjBy8BgdvTLifTJqW~Frxo1ctToQ-XefQjOdGoLCXH-8My97X~1QC9enima5A29KQxZDziGnh2N3CQfbbTEItvFNBzQ~9BZvxyBsXVqROH7xq0s1bCPpB004JOqXsWFdoUsJ-YmYdS3nsSzq87tPFocM2c9sM2MoweRFBpCGrRGJgPV0IMpdtMWvNAb0xT0EJw~Z3RMOjO8RBXJbk1BplUZI4~2YIsolmTJN0JrhG0Ku3Va5pT6OXpPIg__',
            'https://s3-alpha-sig.figma.com/img/c55d/ef94/e44e69d5bb8503477a7eca59e753bffa?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=I2fCD1dVPDI1k0k1QlLtfIITI7sfkqxVfbBwLf5tRgMDzgkquF2QJ9mijEsclFrsrl6V5fsn0aPatkzGLEJJeFcBrVUSd12irDVBYWlV6HbMeuCB5gmlLWvg188wdRHwIkS7lPgC73ZiPHMrPCKseEoM1jWFG95AaJwELGg2I~9JCOpNOUKwIHVj0jOptJyUmkESPWG-9bv76-0pP0vDdZs-qMQ7KI9HYskgguDJl9uS3M7x3xx9jQC5J1VPOPj3yO1-WM8TTzXDRLtP6oOR2jKaFUPsRYYrClPXHHZl0bIiUW3YRAnIr-ST~rJ2GYFsDiWzgt0no-3reVwswwziag__',
            'https://s3-alpha-sig.figma.com/img/8b25/f292/89e88889188d07ef9624cbc063aa7fc2?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LBjyKBJsWjzd63vpMvGhRr6ELqZVgErnPwNdY0cLc8UC7QxOJ9fDPEDdks5v5DclJ~L5DO8G6lAv42EjEjmn7D1ZhrFTOQPAmg62C2Jnxy5GdCTfekEqEEB2NC2NIuD-n2HTsMWl7ZZJiQxoYl75wy4jEOK7mBLaAd9Mm86NunIvaotMFJ66-NIwSsAe3Fmd1A-sUwteGJ8NYatDmxZeo66FiIU-Xk151QcHmq9vyps1hzIqfiUHR7dYhHmXsPIEEXU3wCmlYYBLqBp7wh02OtMvHD0GGo9283ntv9V4vkg04ioVBcJXxb1yH8rRvdy23UXmo3oWqA2WewOWqQTTCw__',
        ],
    },
    {
        id: 8, date: '2024-09-23', city: 'Arlington', venue: 'Jazz Night', time: 'Fri, 7 PM', attendees: 447,
        attendeesCover: [
            'https://s3-alpha-sig.figma.com/img/9253/cfb9/9b8a861f94614d0a8958ffb8d1ad5f1d?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=lqzCHqYxC4KIv6YpayGX2ktMb3VtVV50lONX3kRjfpf9-w~9Jybjtgf33s3-5V0Kxf1frsXwK52~F0XrLxWXuUx-Rz0kDxjBy8BgdvTLifTJqW~Frxo1ctToQ-XefQjOdGoLCXH-8My97X~1QC9enima5A29KQxZDziGnh2N3CQfbbTEItvFNBzQ~9BZvxyBsXVqROH7xq0s1bCPpB004JOqXsWFdoUsJ-YmYdS3nsSzq87tPFocM2c9sM2MoweRFBpCGrRGJgPV0IMpdtMWvNAb0xT0EJw~Z3RMOjO8RBXJbk1BplUZI4~2YIsolmTJN0JrhG0Ku3Va5pT6OXpPIg__',
            'https://s3-alpha-sig.figma.com/img/c55d/ef94/e44e69d5bb8503477a7eca59e753bffa?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=I2fCD1dVPDI1k0k1QlLtfIITI7sfkqxVfbBwLf5tRgMDzgkquF2QJ9mijEsclFrsrl6V5fsn0aPatkzGLEJJeFcBrVUSd12irDVBYWlV6HbMeuCB5gmlLWvg188wdRHwIkS7lPgC73ZiPHMrPCKseEoM1jWFG95AaJwELGg2I~9JCOpNOUKwIHVj0jOptJyUmkESPWG-9bv76-0pP0vDdZs-qMQ7KI9HYskgguDJl9uS3M7x3xx9jQC5J1VPOPj3yO1-WM8TTzXDRLtP6oOR2jKaFUPsRYYrClPXHHZl0bIiUW3YRAnIr-ST~rJ2GYFsDiWzgt0no-3reVwswwziag__',
            'https://s3-alpha-sig.figma.com/img/8b25/f292/89e88889188d07ef9624cbc063aa7fc2?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LBjyKBJsWjzd63vpMvGhRr6ELqZVgErnPwNdY0cLc8UC7QxOJ9fDPEDdks5v5DclJ~L5DO8G6lAv42EjEjmn7D1ZhrFTOQPAmg62C2Jnxy5GdCTfekEqEEB2NC2NIuD-n2HTsMWl7ZZJiQxoYl75wy4jEOK7mBLaAd9Mm86NunIvaotMFJ66-NIwSsAe3Fmd1A-sUwteGJ8NYatDmxZeo66FiIU-Xk151QcHmq9vyps1hzIqfiUHR7dYhHmXsPIEEXU3wCmlYYBLqBp7wh02OtMvHD0GGo9283ntv9V4vkg04ioVBcJXxb1yH8rRvdy23UXmo3oWqA2WewOWqQTTCw__',
        ],
    },
    {
        id: 9, date: '2024-10-01', city: 'New York', venue: 'Rock Fiesta', time: 'Sat, 8 PM', attendees: 320,
        attendeesCover: [
            'https://s3-alpha-sig.figma.com/img/9253/cfb9/9b8a861f94614d0a8958ffb8d1ad5f1d?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=lqzCHqYxC4KIv6YpayGX2ktMb3VtVV50lONX3kRjfpf9-w~9Jybjtgf33s3-5V0Kxf1frsXwK52~F0XrLxWXuUx-Rz0kDxjBy8BgdvTLifTJqW~Frxo1ctToQ-XefQjOdGoLCXH-8My97X~1QC9enima5A29KQxZDziGnh2N3CQfbbTEItvFNBzQ~9BZvxyBsXVqROH7xq0s1bCPpB004JOqXsWFdoUsJ-YmYdS3nsSzq87tPFocM2c9sM2MoweRFBpCGrRGJgPV0IMpdtMWvNAb0xT0EJw~Z3RMOjO8RBXJbk1BplUZI4~2YIsolmTJN0JrhG0Ku3Va5pT6OXpPIg__',
            'https://s3-alpha-sig.figma.com/img/c55d/ef94/e44e69d5bb8503477a7eca59e753bffa?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=I2fCD1dVPDI1k0k1QlLtfIITI7sfkqxVfbBwLf5tRgMDzgkquF2QJ9mijEsclFrsrl6V5fsn0aPatkzGLEJJeFcBrVUSd12irDVBYWlV6HbMeuCB5gmlLWvg188wdRHwIkS7lPgC73ZiPHMrPCKseEoM1jWFG95AaJwELGg2I~9JCOpNOUKwIHVj0jOptJyUmkESPWG-9bv76-0pP0vDdZs-qMQ7KI9HYskgguDJl9uS3M7x3xx9jQC5J1VPOPj3yO1-WM8TTzXDRLtP6oOR2jKaFUPsRYYrClPXHHZl0bIiUW3YRAnIr-ST~rJ2GYFsDiWzgt0no-3reVwswwziag__',
            'https://s3-alpha-sig.figma.com/img/8b25/f292/89e88889188d07ef9624cbc063aa7fc2?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LBjyKBJsWjzd63vpMvGhRr6ELqZVgErnPwNdY0cLc8UC7QxOJ9fDPEDdks5v5DclJ~L5DO8G6lAv42EjEjmn7D1ZhrFTOQPAmg62C2Jnxy5GdCTfekEqEEB2NC2NIuD-n2HTsMWl7ZZJiQxoYl75wy4jEOK7mBLaAd9Mm86NunIvaotMFJ66-NIwSsAe3Fmd1A-sUwteGJ8NYatDmxZeo66FiIU-Xk151QcHmq9vyps1hzIqfiUHR7dYhHmXsPIEEXU3wCmlYYBLqBp7wh02OtMvHD0GGo9283ntv9V4vkg04ioVBcJXxb1yH8rRvdy23UXmo3oWqA2WewOWqQTTCw__',
        ],
    },
    {
        id: 10, date: '2024-09-30', city: 'Boston', venue: 'Blues Evening', time: 'Sun, 6 PM', attendees: 270,
        attendeesCover: [
            'https://s3-alpha-sig.figma.com/img/9253/cfb9/9b8a861f94614d0a8958ffb8d1ad5f1d?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=lqzCHqYxC4KIv6YpayGX2ktMb3VtVV50lONX3kRjfpf9-w~9Jybjtgf33s3-5V0Kxf1frsXwK52~F0XrLxWXuUx-Rz0kDxjBy8BgdvTLifTJqW~Frxo1ctToQ-XefQjOdGoLCXH-8My97X~1QC9enima5A29KQxZDziGnh2N3CQfbbTEItvFNBzQ~9BZvxyBsXVqROH7xq0s1bCPpB004JOqXsWFdoUsJ-YmYdS3nsSzq87tPFocM2c9sM2MoweRFBpCGrRGJgPV0IMpdtMWvNAb0xT0EJw~Z3RMOjO8RBXJbk1BplUZI4~2YIsolmTJN0JrhG0Ku3Va5pT6OXpPIg__',
            'https://s3-alpha-sig.figma.com/img/c55d/ef94/e44e69d5bb8503477a7eca59e753bffa?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=I2fCD1dVPDI1k0k1QlLtfIITI7sfkqxVfbBwLf5tRgMDzgkquF2QJ9mijEsclFrsrl6V5fsn0aPatkzGLEJJeFcBrVUSd12irDVBYWlV6HbMeuCB5gmlLWvg188wdRHwIkS7lPgC73ZiPHMrPCKseEoM1jWFG95AaJwELGg2I~9JCOpNOUKwIHVj0jOptJyUmkESPWG-9bv76-0pP0vDdZs-qMQ7KI9HYskgguDJl9uS3M7x3xx9jQC5J1VPOPj3yO1-WM8TTzXDRLtP6oOR2jKaFUPsRYYrClPXHHZl0bIiUW3YRAnIr-ST~rJ2GYFsDiWzgt0no-3reVwswwziag__',
            'https://s3-alpha-sig.figma.com/img/8b25/f292/89e88889188d07ef9624cbc063aa7fc2?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LBjyKBJsWjzd63vpMvGhRr6ELqZVgErnPwNdY0cLc8UC7QxOJ9fDPEDdks5v5DclJ~L5DO8G6lAv42EjEjmn7D1ZhrFTOQPAmg62C2Jnxy5GdCTfekEqEEB2NC2NIuD-n2HTsMWl7ZZJiQxoYl75wy4jEOK7mBLaAd9Mm86NunIvaotMFJ66-NIwSsAe3Fmd1A-sUwteGJ8NYatDmxZeo66FiIU-Xk151QcHmq9vyps1hzIqfiUHR7dYhHmXsPIEEXU3wCmlYYBLqBp7wh02OtMvHD0GGo9283ntv9V4vkg04ioVBcJXxb1yH8rRvdy23UXmo3oWqA2WewOWqQTTCw__',
        ],
    },
];

// Format text utility function
const formatText = (text, maxChars) => (text.length <= maxChars ? text : text.slice(0, maxChars) + '...');

// Helper function to get display date (adjusted by one day if needed)
const getDisplayDate = (date) => {
    const eventDate = new Date(date);
    eventDate.setDate(eventDate.getDate() + 1);
    return eventDate;
};

// Event card component
const EventCard = ({ event }) => {
    const displayDate = getDisplayDate(event.date);

    return (
        <TouchableOpacity style={styles.eventCard}>
            <View style={styles.dateContainer}>
                <Text style={styles.month}>{displayDate.toLocaleString('en-US', { month: 'short' })}</Text>
                <Text style={styles.when}>{displayDate.getDate()}</Text>
            </View>
            <View style={styles.eventInfo}>
                <Text style={styles.city}>{formatText(event.city, 24)}</Text>
                <Text style={styles.venue}>
                    {formatText(event.time, 18)} • {formatText(event.venue, 18)}
                </Text>
                <View style={styles.attendeesContainer}>
                    <View style={styles.attendeeImages}>
                        {event.attendeesCover.map((cover, index) => (
                            <Image
                                key={index}
                                source={{ uri: cover }}
                                style={[styles.attendeeImage, { left: index * 25, zIndex: index }]}
                            />
                        ))}
                    </View>
                    <View style={styles.attendeeCountContainer}>
                        <Image source={require('../../assets/images/UserProfile/user.png')} style={styles.userIcon} />
                        <Text style={styles.attendeeCount}>{event.attendees}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// Main Events component
const Events = () => {
    const [showAllUpcoming, setShowAllUpcoming] = useState(false);
    const [showAllPast, setShowAllPast] = useState(false);

    const currentDate = new Date();

    // Separate events into upcoming and past
    const upcomingEvents = events.filter(event => new Date(event.date) > currentDate).sort((a, b) => new Date(b.date) - new Date(a.date));;
    const pastEvents = events.filter(event => new Date(event.date) <= currentDate);

    // Determine which portion of the arrays to show initially
    const displayedUpcomingEvents = showAllUpcoming ? upcomingEvents : upcomingEvents.slice(0, 3).sort((a, b) => new Date(b.date) - new Date(a.date));;
    const displayedPastEvents = showAllPast ? pastEvents : pastEvents.slice(0, 3);

    return (
        <View style={styles.container}>
            <Section
                title="UPCOMING EVENTS"
                showAll={showAllUpcoming}
                onToggleShowAll={() => setShowAllUpcoming(!showAllUpcoming)}
                events={displayedUpcomingEvents}
                hasMore={upcomingEvents.length > 3}
            />
            <Section
                title="PAST EVENTS"
                showAll={showAllPast}
                onToggleShowAll={() => setShowAllPast(!showAllPast)}
                events={displayedPastEvents}
                hasMore={pastEvents.length > 3}
            />
        </View>
    );
};

// Section component to render each section
const Section = ({ title, showAll, onToggleShowAll, events, hasMore }) => (
    <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {hasMore && (
                <TouchableOpacity onPress={onToggleShowAll}>
                    <Text style={styles.showAllText}>{showAll ? 'Show Less' : 'Show All'}</Text>
                </TouchableOpacity>
            )}
        </View>
        <FlatList
            data={events}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <EventCard event={item} />}
            scrollEnabled={false}
        />
    </View>
);

export default Events;

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        color: Colors.white,
        fontFamily: "Open Sans",
        fontSize: 12,
        fontWeight: '700',
        lineHeight: 18,
    },
    showAllText: {
        color: Colors.white,
        fontFamily: "Open Sans",
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 18,
    },
    eventCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
        borderRadius: 10,
        marginBottom: 16,
        padding: 12,
    },
    dateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#363636',
        width: 55,
        height: 116,
        borderRadius: 5,
    },
    month: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
    when: {
        color: Colors.white,
        fontSize: 28,
        fontWeight: '700',
    },
    eventInfo: {
        flex: 1,
        paddingHorizontal: 16,
    },
    city: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: '700',
    },
    venue: {
        color: '#ACACAC',
        fontSize: 12,
        fontWeight: '600',
    },
    attendeesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 42,
        marginTop: 10,
    },
    attendeeImages: {
        flexDirection: 'row',
        marginTop: 'auto',
        position: 'relative',
        marginRight: 48,
    },
    attendeeImage: {
        width: 35,
        height: 35,
        borderRadius: 35,
        position: 'absolute',
        borderWidth: 2,
        borderColor: 'white',
        top: -28,
    },
    attendeeCountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userIcon: {
        width: 20,
        height: 20,
        marginRight: 6,
    },
    attendeeCount: {
        color: Colors.white,
        fontFamily: 'Open Sans',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: 20,
    },
});
