import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../../constants/Color';

const dummyData = {
    nextEvents: [
        { date: 'Tomorrow', title: 'Big Event at Grand Hall' },
        { date: 'Sat 9/24', title: 'Small Event at Cabana' }
    ],
    frequentlyVisited: [
        { width: 104.384, height: 25, image: 'https://s3-alpha-sig.figma.com/img/0ca3/b796/7d55a72da009f99c2167e4fb6ae0a083?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=pHPOqPCXa9AhAAn-y380QeFvwI0BC18nMQtS0eYN4TWziDx5hSmUufeuNeXy3IubiFmB0Xc45HeJMUoSCNwdj-FEzAULnsr9xOfFL1NpkO6ffXKEugsI5dg9kCgHV~yg4zK8X8ZLZRmpoHL2CEBS~pRy2yp77bYiZQiBVxhm3oXU3ePAmGYSVdn0ks08hmp7~gIYg0Tc3B6NnhYzAUFWoYa9NmViq9gceAYcJGJaQmQMYzI0UcZLacL-riEVefkHVSErJa2fbvu8hBi-~jzYG7rlEJ6tW5QRMVLrzYBG-aLJq2m2dzOQbcCRcPe1PSCzaxd9pXkbnYfbWHwre3ksFw__' },
        { width: 98.691, height: 69, image: 'https://s3-alpha-sig.figma.com/img/2323/19a3/47748154f5c6d6a7445b1939e5007147?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=hPHckefO2VkEtek9ha6Dxv3YjYCt0Pd04Mv2pUX7-GvOLek~AhtADrdChVAQG1oXaWpS~oJXHPK7GkxO5bQS0x82E8qft5vE~s4BvK8gAm3jsOD3mRFB2FEjlf9UfxmDJ0IdiPwrAm8bmWdHTENadsw1lAgaWrjQuCaz~BOPLm66kW4btV~60b8SB9GDyz0dHvu7jVKRopo5WX3nPvGL3caWxSKFJePdTWTXKpPqDJFUyIjM8qEhy~EEtxxfiynEpoFyNnDdBC0c~QYaLe5IeuCy5nJ3TXux3~bg0GwmTqnn1-jlIicoVak7VbFUGbkQgl8qklIHJKEBdVNMRLT6uQ__' },
        { width: 65.477, height: 69, image: 'https://s3-alpha-sig.figma.com/img/47c8/94b7/40a7761e0a1b32dd7a7c558bdefcc8cf?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Dgzh15UkiJJJztASRQ~BbuYZbNZ1sG5bN42YITP1YxphMKWMEqQI1ZbSP37W6Z-1BHfGVfR2MzacBWsv11wZmXYNSlAoPAJYNLOlNRO7Em7YR6cUNXCxl1xVbGdgIZUbQU~pN3qAhnf5Tqr7Zxjhz8idfSATOjNaXVaJ9JvVtFmgsSHBZkhaApl~bfUJqoF0qNmegAfUD1XXJsoAGNc8UkLTAdezesDsRit8hOGe4th4zqMP6-GbJ6ktFcS0szVdYJRDj0KfIX2sqN~OEVhrRW-y3m1MwLMsNpAKeVaB5GDhd0vGyuaExgJxgQZfwAY0p3Zgxfa4QpQrcdamq56giA__' },
        { width: 148.895, height: 69, image: 'https://s3-alpha-sig.figma.com/img/9054/d7eb/c0ea589e280eaae7d86f909f8386ff0c?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=dm8OUGq06xJIhc1PeqmZjJFc2Lt4DzDpxsbfYQ-2yN8uejIYcffhoODRlFpMe3Y7O8sbAMmtckscGBWp~1GF0ffSN8MTiIZNJyWpPK2Z0qI7b4ySlxxtXCWitubtgZtyUahvHW418MbNxtFpFZEmcWOk~yzf1pNePlz97AUGSisUXCPpAmU9muhdEB4gGRbjgwvHJeIdUdZXHT~mLg5lc9ImPJDMvD8hQUUaYjjYt09AVFUA7jIstTYcoiVt1tIZWfbLm-8-DX1fsuIbOBbGC0~SJROgoVZLQwRljq7Rf4TJi4L1nBpQt4ZC67TyKpfaJJMaX5ZDOO1YAbChCATIlw__' }
    ],
    albums: [
        { title: 'Desert Rose', artist: 'Estella Boersma', image: 'https://s3-alpha-sig.figma.com/img/43ee/fe5f/eedadbcfbad2d5fc3b3528456b8ca856?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=JcBalQcY2XlqCqGiRnO-uymwjVLX-Rph1stFlTSNEVEasijC-7gopVd1ds6-rq~XyOj7TtKkwVnVpVt6tn5nbMjrY5NVkbj4N3AwaBkD6EamBd9HrfLcKqqLKGRSjL-Na2EhbLFRmJ2FTSiK5OoAgQ5PAvjlP-8xmSggvXGMojowNrrCviEGPaO6rwSUZeXheaF1uLhb~RRXMOZO9Vb1r8o7Idqk8ga77gtj2uC7qdxdw6EST-ApmflrzaxvqjG5ReRiXzuQZxhYHd22o51I5LP1m45QhfWuAixx3xP3g2nyIa20cyUulITPcpwv4y1TMO73~2tnRBjgPvctUnHkIA__' },
        { title: 'Casette', artist: 'Emma Castille', image: 'https://s3-alpha-sig.figma.com/img/c30b/7243/b57b636c0fd51dc7e9316b12e62e2366?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=fVeBJ4IMhsYUcaIu5VVZLU~4YBtaXwd7EwVbOYWsjNh4~VhAB0LTf1dnrdmbUR8hEtDCjLBRoLL43CeTrlaadLlvPuuT5sDD7IZwtkYDxuKUQASWgGdg9UgXG4XkkoFQRR2Dsv2tWxiAuzWNuL-opMKQJ9-XK684hKkFjH1zPdwGL9H2RXeHULR9D8W0x8dsdVR2elNcIcGJ9h0FoDaqjYHmheNH~0Zf5gDPQLE1usVKIw3663kNZeJFEvvTbJT9bGBgsgYTz9JFaSiVyrluCPcNHal3mz1kSdwI1phqqaESsc5qkyfdMjMIRqLJNwUUAUx~GNYktYRLI-GrvkcNdA__' },
        { title: 'Spine of Sound', artist: 'Eggy Sims', image: 'https://s3-alpha-sig.figma.com/img/e698/f8bb/e28173d0fae136574ba275fc7f45235b?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=GQnEqmCDg2jij9L0BhQqVGIKiaUuV4Oz-Cz~UdNZFynaEyTOZ3LeuwaNZRO3ytsXNHgKoj5eJOlNwgoP8jwuE6Y2xJUoQDazhju1RX1X5nz78Kc2R13rVDP8eJibT-fFTBxPec3uWsx6FDNVfgQ~6zQdbGk7x4xYr~5~rQz6nf8t6XuSt8VLaXi5eg~pjyYtIp9ieM1F3xVAzjVQUwwoOInF2iVOcY~u0YYRIpUdSt2-RBnon1Jck5GStQWTFFB6fjna4QnC96AWjlg6cU278Skg29aTD1dhkkicGZkrArqosIxWKUCus535HP4vYUFMGVA6MpTOgXXg3sZ77a64ww__' },
        { title: 'Infinity', artist: 'Estella Boersma', image: 'https://s3-alpha-sig.figma.com/img/bbb5/da18/99c82be7b2ee87381aaf434cff3bd601?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=kpUV23bHEMJtatp1ako9DYq~Dp7d5mapHZ2cd4lzOBnfedKFAzPihyCBvEe4A0GXoSXiVY0M1sdqR3WfXyQmZNhwTKLR8nh9aTiTidNYhT~MAAo~kmwL6Hvmx4TocDZU0Uv3pjFz1VGqoKKst9FTQ8DICVyDwkcJ4bbrTww6oYWche9ClB8U7FEyAM3-mvYK~Z5roGyAl0ubD59XP1ugEWWmSzy1v0kx5JxoMUIE4NEOuPAS3fOUWIVbDIdLuh5eh-QXHhyAf5ahXMnX~P4hsxa5RxsN-RVkoop2YbIeluD9N9X4XGS4NCPKiF6p0eIlyUVutgeEf3U491ngGeI7pw__' }
    ],
    topArtists: [
        { name: 'Chris StickStorm', location: '#1 in DMV', image: 'https://s3-alpha-sig.figma.com/img/3a99/40a0/a23905edd5b37359f5ce63fb81871a65?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=MNdB2TTD3AeGcE6e6eIZ0PUW6XRtK33wd~ZATxHyv2S1byCN4jVQVYu9mi7zQkXmwriFScR~KYGUCjgQNGlR0oIOwmfVXm4gnvscR2AMoiAUQbB4i7QQo0C0VWE~aNsIOCU350zMZUKp9jYByni-MsplDGSjaJ~LngE2pv-Ilb7biJVxigKKLVjUgirzPTO4wYkc3iDtvN7lchbfImAIaWDe7YG3ohGazsGDiQQMWoZoJfzxvpMLDIzuPm2wtRM8vdDzG-wADTsRXnydjfr7OsTnjP8xskwWEA0f1aTZgB8B1LCKFvRSD38LOcJJ0Du-dUsYYkpFSZdNjCdrrbpZBA__' },
        { name: 'Alvin Sings', location: '#3 in Arlington', image: 'https://s3-alpha-sig.figma.com/img/33b6/e23a/c5a022c760101ea01054126f1649bbc2?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=e7OBLBF06Ra2nJcPySGJanJg0GQfRr~ldE7zMELSgDAH8bVbAtByrJNugWtxuccntoHGbpgzeOEIBFQZ2AvB~8mK3zuNp7fizfX0suwaLQl5~EXD1SJMF~swzbTBCBbZBpVuvn-HgDDRwT-Bwt6ip14ZuuoUaJ87yuZidOmcQpJw5zMSslRlWpznl7U6gXuHd9H4rq8YMxD-FEapUxNBYIDMzrjy0pRTMhN2OqfolC6xiAS7AS1KZTuGXURI475FXG8W9mqJqPOVSFRNYC7T2is4nP97X4zZ5HbDVlY9~WxpO0fI1bdTyPHEMhAxS8-ykTxbyJE25clMJM1xrQtbgQ__' },
        { name: 'EchoWave', location: '#2 in DMV', image: 'https://s3-alpha-sig.figma.com/img/3d7d/27ca/11e0590cfdd68660794572ffe72b9af7?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=KJoCtR~GR6hvnn~ZkIu9cRix9UvKApm2S0JeRS51yOL7RoVLHvBzQf~wj5mB23g0JvOg5I-HwMeoAIJ8oPdrsWHOgoLRnPMDk~H0CaEssbPAsP34t2u6oRseLRuJuuNtUfExMCjgS6Ip0nOqAeo6Au9L4SDnXySB4A6FzTXkC4yDVGrs-sUq3eRQP34KWpHSeVopxKjfQ-MbJzWsP4S0ngaNLCY3AiJTqkh~1bK-axG82EMnotVOiFfUhAK2aE4r9M4DDiGjpkMy~BxHq0kpq9~8YMJr73PszOBm9xu3uPkFlq2nODhvSkRXZXEPeURetbcDxmA67enUQ1w~-NQJ5Q__' }
    ],
    recentlyPlayed: [
        { title: 'Best Friend', artist: 'Emma', duration: '3:24', image: 'https://s3-alpha-sig.figma.com/img/4523/2815/df8717223b3e8146d650d34e2f1aae47?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=CfzM024rGG9qWB~is-tUz3dK5j-UZ~S4LYDS8UI-5wt26soTfBlmOJklR2lSBK300zKMzjp18800JUBXFsBoVizUn~gPMsyyzxuJM2ky-cJ2VLlQ1FN4PZj4UFXoWNNMdJnUEVNVcq3rCu2oXdQPJuAdpzF-1hJivL6tB9q-nems-TqHEPSz1Mb9S3jaj8d1JJxspINigAWu04e-Obxvq79mXeVC9TkfhotX4Omeuy~7wui3bGolRg25yVKQ~-OiGIJoEmZoaXZuWmC5sSLeo9nenD7alqrqkSNvTjswkTZCrrXMzRun6UwaFLewOhANmqNFyE1ah6rl4yd~bNIh1Q__' },
        { title: 'Odd One Out', artist: 'Emma', duration: '3:24', image: 'https://s3-alpha-sig.figma.com/img/2056/8422/4cc877303632c954b8cf7c292bd9d7c0?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=e58tVKqurpqHzA5xUWVVZt9uH6OWfv5cq8qLAv8y7B6s311JqBvr45GDN5HWcao-FV2yf6IGDPv6LvszoLmUEu0ndoQip3Oj3Q9l04BL8XHa6pl3AmnDSgw5MNr9NzwSqxf4n3jg-S8W1MHZ2u7cFJucY~syAhbW~aMxTaJLYnVqjMSnWwCtT523jhoxqR3b3-V8X77DKRMtsSbPLaEzdAF81QT2g0K19emJ5qgRMZK6Bi4Ntd~G-BnKzCxx-hcSpDti5PULUJpw3Z4cNTVtqJBAK5sELMEuUIk~Bt3kcvhPF7SlhkPJFbz0k7BTXNuahpojsufXNkM38zev5uzzVg__' },
        { title: 'Need You Now', artist: 'Jesse Juice', duration: '3:24', image: 'https://s3-alpha-sig.figma.com/img/59df/9547/2678d3d075a1f8d1eb4d4abf6ae9dce2?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=j3Vbh70odNHYGpBQJrUOAIq2sMCoFwloguCyh5LGnGux0vNYAqwKwM7gLPKb-B40jUXZ55lFzjvuREvu5kYNDgi~xbybJ467c12UkeDXBJPzDZX99XvwdcH1twrx5Koeg5faGvnebugiqAr4BdPPoRrqHHi5wvz510YuFEaQY~WZRJ-g4xFI9uXvJ8KtZmL5IV6ck-nlLwLZwXDfAApcNVLSVqUGMbLIG7iHBg3lKQvOxRG3qcnVBrcfCrs2NoS6v4FdDMWKlK~I6KEr2e8KczMjWxDLfzrhVgDrkuZJm3-tLgTNTqd7bRNyHmc9kKY0rzTt1vPDDJT4qctCr6jB3g__' }
    ],
    groups: [
        {
            name: 'Disco Vibes',
            attendees: 447,
            attendeesCover: [
                'https://s3-alpha-sig.figma.com/img/9253/cfb9/9b8a861f94614d0a8958ffb8d1ad5f1d?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=lqzCHqYxC4KIv6YpayGX2ktMb3VtVV50lONX3kRjfpf9-w~9Jybjtgf33s3-5V0Kxf1frsXwK52~F0XrLxWXuUx-Rz0kDxjBy8BgdvTLifTJqW~Frxo1ctToQ-XefQjOdGoLCXH-8My97X~1QC9enima5A29KQxZDziGnh2N3CQfbbTEItvFNBzQ~9BZvxyBsXVqROH7xq0s1bCPpB004JOqXsWFdoUsJ-YmYdS3nsSzq87tPFocM2c9sM2MoweRFBpCGrRGJgPV0IMpdtMWvNAb0xT0EJw~Z3RMOjO8RBXJbk1BplUZI4~2YIsolmTJN0JrhG0Ku3Va5pT6OXpPIg__',
                'https://s3-alpha-sig.figma.com/img/c55d/ef94/e44e69d5bb8503477a7eca59e753bffa?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=I2fCD1dVPDI1k0k1QlLtfIITI7sfkqxVfbBwLf5tRgMDzgkquF2QJ9mijEsclFrsrl6V5fsn0aPatkzGLEJJeFcBrVUSd12irDVBYWlV6HbMeuCB5gmlLWvg188wdRHwIkS7lPgC73ZiPHMrPCKseEoM1jWFG95AaJwELGg2I~9JCOpNOUKwIHVj0jOptJyUmkESPWG-9bv76-0pP0vDdZs-qMQ7KI9HYskgguDJl9uS3M7x3xx9jQC5J1VPOPj3yO1-WM8TTzXDRLtP6oOR2jKaFUPsRYYrClPXHHZl0bIiUW3YRAnIr-ST~rJ2GYFsDiWzgt0no-3reVwswwziag__',
                'https://s3-alpha-sig.figma.com/img/8b25/f292/89e88889188d07ef9624cbc063aa7fc2?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LBjyKBJsWjzd63vpMvGhRr6ELqZVgErnPwNdY0cLc8UC7QxOJ9fDPEDdks5v5DclJ~L5DO8G6lAv42EjEjmn7D1ZhrFTOQPAmg62C2Jnxy5GdCTfekEqEEB2NC2NIuD-n2HTsMWl7ZZJiQxoYl75wy4jEOK7mBLaAd9Mm86NunIvaotMFJ66-NIwSsAe3Fmd1A-sUwteGJ8NYatDmxZeo66FiIU-Xk151QcHmq9vyps1hzIqfiUHR7dYhHmXsPIEEXU3wCmlYYBLqBp7wh02OtMvHD0GGo9283ntv9V4vkg04ioVBcJXxb1yH8rRvdy23UXmo3oWqA2WewOWqQTTCw__',
            ],
            image: 'https://s3-alpha-sig.figma.com/img/089f/d320/c10222774a42edd7a7ca08dd895f7279?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=UwnR8JIXft2UBdBwujPBk8dqrRlSk2Qf950Q45ShNFgXb10fyFh8U2yB9q6B6r3k1qMR1G3okxi8CgJ6BzDg-nRhIto8HAqzG1wZegdzWVMP34A5E2bD0TnCEonZ0ITjBGimYemwvfX1dIxkpsrK75Dpz~-QQEsDyZf-fribn0b7mC4zClVvLYKJwhD3UvTcgFgFdHgi3P22zkdW54TgStHnp9nmVaoh~OFsOb0PU24KXBTbIEhLzOUxgp2YPn3PcpMv0HjJMKdaUZ630T7SlLyIx6PUQJUeDMwpY6N1fnW5JCDZolEBvKq3gLiO8Il7D5HEzdssW7Pzgfu0ZdZIzA__'
        },
        {
            name: 'Fair 2024',
            attendees: 647,
            attendeesCover: [
                'https://s3-alpha-sig.figma.com/img/9253/cfb9/9b8a861f94614d0a8958ffb8d1ad5f1d?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=lqzCHqYxC4KIv6YpayGX2ktMb3VtVV50lONX3kRjfpf9-w~9Jybjtgf33s3-5V0Kxf1frsXwK52~F0XrLxWXuUx-Rz0kDxjBy8BgdvTLifTJqW~Frxo1ctToQ-XefQjOdGoLCXH-8My97X~1QC9enima5A29KQxZDziGnh2N3CQfbbTEItvFNBzQ~9BZvxyBsXVqROH7xq0s1bCPpB004JOqXsWFdoUsJ-YmYdS3nsSzq87tPFocM2c9sM2MoweRFBpCGrRGJgPV0IMpdtMWvNAb0xT0EJw~Z3RMOjO8RBXJbk1BplUZI4~2YIsolmTJN0JrhG0Ku3Va5pT6OXpPIg__',
                'https://s3-alpha-sig.figma.com/img/c55d/ef94/e44e69d5bb8503477a7eca59e753bffa?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=I2fCD1dVPDI1k0k1QlLtfIITI7sfkqxVfbBwLf5tRgMDzgkquF2QJ9mijEsclFrsrl6V5fsn0aPatkzGLEJJeFcBrVUSd12irDVBYWlV6HbMeuCB5gmlLWvg188wdRHwIkS7lPgC73ZiPHMrPCKseEoM1jWFG95AaJwELGg2I~9JCOpNOUKwIHVj0jOptJyUmkESPWG-9bv76-0pP0vDdZs-qMQ7KI9HYskgguDJl9uS3M7x3xx9jQC5J1VPOPj3yO1-WM8TTzXDRLtP6oOR2jKaFUPsRYYrClPXHHZl0bIiUW3YRAnIr-ST~rJ2GYFsDiWzgt0no-3reVwswwziag__',
                'https://s3-alpha-sig.figma.com/img/8b25/f292/89e88889188d07ef9624cbc063aa7fc2?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LBjyKBJsWjzd63vpMvGhRr6ELqZVgErnPwNdY0cLc8UC7QxOJ9fDPEDdks5v5DclJ~L5DO8G6lAv42EjEjmn7D1ZhrFTOQPAmg62C2Jnxy5GdCTfekEqEEB2NC2NIuD-n2HTsMWl7ZZJiQxoYl75wy4jEOK7mBLaAd9Mm86NunIvaotMFJ66-NIwSsAe3Fmd1A-sUwteGJ8NYatDmxZeo66FiIU-Xk151QcHmq9vyps1hzIqfiUHR7dYhHmXsPIEEXU3wCmlYYBLqBp7wh02OtMvHD0GGo9283ntv9V4vkg04ioVBcJXxb1yH8rRvdy23UXmo3oWqA2WewOWqQTTCw__',
            ],
            image: 'https://s3-alpha-sig.figma.com/img/55b4/754b/063f86513b45d56567bc364fee718974?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=bVx0u5i~S9slTUGw2ixZ53VVlbdyZF9vD6aFMyiGu0N9EiHLWdA7tBDo5PyMGiwS5SHS18QXz7mdOHnyg2XcNb0~dTUatK0jx5PEWEtP0Kwzpiu5878UU0SDrRryzqbIau~Wok-mHIGZ4whW4mcPhNxI5K7vIhIlxCQuW4OPVsP~2Ui5rPMsPzIDrRcvoUlqLwK7EC019xxCwVz2VDIUWT8R3e0IvC5Op262M4U7RPigl0dD9kTHWbpwWm7WQkyn5YDXxULMj7-psZdgklYkDXa3UqTymu2pOutk-CuC~c9KpMHrMS3B0-uYXQZcpzWkJGrGsugJIfc9MAaR07JDSg__'
        },
        {
            name: 'Girl United',
            attendees: 300,
            attendeesCover: [
                'https://s3-alpha-sig.figma.com/img/9253/cfb9/9b8a861f94614d0a8958ffb8d1ad5f1d?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=lqzCHqYxC4KIv6YpayGX2ktMb3VtVV50lONX3kRjfpf9-w~9Jybjtgf33s3-5V0Kxf1frsXwK52~F0XrLxWXuUx-Rz0kDxjBy8BgdvTLifTJqW~Frxo1ctToQ-XefQjOdGoLCXH-8My97X~1QC9enima5A29KQxZDziGnh2N3CQfbbTEItvFNBzQ~9BZvxyBsXVqROH7xq0s1bCPpB004JOqXsWFdoUsJ-YmYdS3nsSzq87tPFocM2c9sM2MoweRFBpCGrRGJgPV0IMpdtMWvNAb0xT0EJw~Z3RMOjO8RBXJbk1BplUZI4~2YIsolmTJN0JrhG0Ku3Va5pT6OXpPIg__',
                'https://s3-alpha-sig.figma.com/img/c55d/ef94/e44e69d5bb8503477a7eca59e753bffa?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=I2fCD1dVPDI1k0k1QlLtfIITI7sfkqxVfbBwLf5tRgMDzgkquF2QJ9mijEsclFrsrl6V5fsn0aPatkzGLEJJeFcBrVUSd12irDVBYWlV6HbMeuCB5gmlLWvg188wdRHwIkS7lPgC73ZiPHMrPCKseEoM1jWFG95AaJwELGg2I~9JCOpNOUKwIHVj0jOptJyUmkESPWG-9bv76-0pP0vDdZs-qMQ7KI9HYskgguDJl9uS3M7x3xx9jQC5J1VPOPj3yO1-WM8TTzXDRLtP6oOR2jKaFUPsRYYrClPXHHZl0bIiUW3YRAnIr-ST~rJ2GYFsDiWzgt0no-3reVwswwziag__',
                'https://s3-alpha-sig.figma.com/img/8b25/f292/89e88889188d07ef9624cbc063aa7fc2?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LBjyKBJsWjzd63vpMvGhRr6ELqZVgErnPwNdY0cLc8UC7QxOJ9fDPEDdks5v5DclJ~L5DO8G6lAv42EjEjmn7D1ZhrFTOQPAmg62C2Jnxy5GdCTfekEqEEB2NC2NIuD-n2HTsMWl7ZZJiQxoYl75wy4jEOK7mBLaAd9Mm86NunIvaotMFJ66-NIwSsAe3Fmd1A-sUwteGJ8NYatDmxZeo66FiIU-Xk151QcHmq9vyps1hzIqfiUHR7dYhHmXsPIEEXU3wCmlYYBLqBp7wh02OtMvHD0GGo9283ntv9V4vkg04ioVBcJXxb1yH8rRvdy23UXmo3oWqA2WewOWqQTTCw__',
            ],
            image: 'https://s3-alpha-sig.figma.com/img/e952/0499/7f6c9d9cb61e16fc08d6760950a225a4?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Yih8DSxGEqdWrUkqe2sry5BeHNOiAJxpZzQPALKRZrL791mSORxyuQVHmH3dyOfRKwuKEUTbXzBfsFglbERSDx2qweiK3xrCmmKb75-qFbQxHNIe7WQlSgwlxPr~U6TupSVvbN7bLw8lIS3HhnKFa9PPnu1UzBA95OIpP0put4tzYt5y6MzFrs-2stIXwVJP0Ve5nwJG61BpaATfxUNDb3Fp4KtmS2i5f6seJJGdPrnltNLtsHNjUVx0aHM9-wSsITgFlgFYXWLvyvdNe9nuIOAZTYKoHaqllbpUspIfeI1DJncFeLjWZwpv9lbwHaN9yTmeZA-VukfFW16KM~KGhg__'
        }
    ]
};

const Music = ({ name }) => {
    return (
        <ScrollView style={styles.container}>
            {/* Next Event Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Next Event</Text>
                {dummyData.nextEvents.map((event, index) => (
                    <View key={index} style={styles.eventContainer}>
                        <View style={styles.dates}>
                            <Text style={styles.eventDate}>{event.date}</Text>
                        </View>
                        <View style={styles.titles}>
                            <Text style={styles.eventTitle}>{event.title}</Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Frequently Visited Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Frequently Visited</Text>
                <FlatList
                    horizontal
                    data={dummyData.frequentlyVisited}
                    keyExtractor={(item, index) => index.toString()}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <View style={styles.iconContainer}>
                            <Image source={{ uri: item.image }} style={[styles.iconImage, {
                                height: item.height, width: item.width, backgroundColor: index == 1 && Colors.white
                            }]} />
                        </View>
                    )}
                />
            </View>

            {/* Most Listened to Albums Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Most listened to albums</Text>
                    <Text style={styles.showAll}>Show All</Text>
                </View>
                <FlatList
                    horizontal
                    data={dummyData.albums}
                    keyExtractor={(item, index) => index.toString()}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View style={styles.albumContainer}>
                            <Image source={{ uri: item.image }} style={styles.albumImage} />
                            <Text style={styles.albumTitle}>{item.title}</Text>
                            <Text style={styles.albumArtist}>{item.artist}</Text>
                        </View>
                    )}
                />
            </View>

            {/* Top Artists Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{name}'s top artists</Text>
                    <Text style={styles.showAll}>Show All</Text>
                </View>
                <FlatList
                    horizontal
                    data={dummyData.topArtists}
                    keyExtractor={(item, index) => index.toString()}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View style={styles.artistContainer}>
                            <Image source={{ uri: item.image }} style={styles.artistImage} />
                            <Text style={styles.artistName}>{item.name}</Text>
                            <Text style={styles.artistLocation}>{item.location}</Text>
                        </View>
                    )}
                />
            </View>

            {/* Recently Played Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recently played</Text>
                    <Text style={styles.showAll}>Show All</Text>
                </View>
                {dummyData.recentlyPlayed.map((item, index) => (
                    <View key={index} style={styles.musicCard}>
                        <Image source={{ uri: item.image }} style={styles.musicImage} />
                        <View style={styles.musicInfo}>
                            <Text style={styles.musicTitle}>{item.title}</Text>
                            <Text style={styles.musicArtist}>{item.artist}</Text>
                        </View>
                        <Text style={styles.musicDuration}>{item.duration}</Text>
                        <Image source={require('../../assets/images/UserProfile/play.png')} style={styles.play} />
                    </View>
                ))}
            </View>

            {/* Groups Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>groups</Text>
                    <Text style={styles.showAll}>Show All</Text>
                </View>
                <FlatList
                    horizontal
                    data={dummyData.groups}
                    keyExtractor={(item, index) => index.toString()}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View style={styles.groupContainer}>
                            <Image source={{ uri: item.image }} style={styles.groupImage} />
                            <Text style={styles.groupName}>{item.name}</Text>
                            <View style={styles.attendeesContainer}>
                                <View style={styles.attendeeImages}>
                                    {item.attendeesCover.map((cover, index) => (
                                        <Image
                                            key={index}
                                            source={{ uri: cover }}
                                            style={[styles.attendeeImage, { left: index * 13, zIndex: index }]}
                                        />
                                    ))}
                                </View>

                                {/* ATTENDEES COUNT */}
                                <View style={styles.attendeeCountContainer}>
                                    <Image
                                        source={require('../../assets/images/UserProfile/user.png')}
                                        style={styles.userIcon}
                                    />
                                    <Text style={styles.attendeeCount}>{item.attendees}</Text>
                                </View>
                            </View>
                        </View>
                    )}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#121212',
        padding: 16,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        color: Colors.white,
        fontFamily: "Open Sans",
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: 18,
        textTransform: 'uppercase',
        marginBottom: 18
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    showAll: {
        color: Colors.white,
        fontFamily: "Open Sans",
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 18,
        marginBottom: 18,
        opacity: 0.7
    },
    eventContainer: {
        flexDirection: 'row',
        gap: 22.95,
        marginBottom: 5,
    },
    dates: {
        width: 100.758,
    },
    titles: {
        width: 161.356,
    },
    eventDate: {
        color: Colors.white,
        fontFamily: "Open Sans",
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: '500',
        lineHeight: 14,
        opacity: 0.5,
    },
    eventTitle: {
        color: Colors.white,
        fontFamily: "Open Sans",
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: '500',
        lineHeight: 14,
        opacity: 0.7,
    },
    iconContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        alignSelf: 'stretch',
    },
    iconImage: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
        marginBottom: 5,
        marginRight: 24,
    },
    albumContainer: {
        alignItems: 'center',
        marginRight: 15,
    },
    albumImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 5,
    },
    albumTitle: {
        color: Colors.white,
        textAlign: 'center',
        fontFamily: "Open Sans",
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 18,
    },
    albumArtist: {
        color: Colors.white,
        textAlign: 'center',
        fontFamily: "Open Sans",
        fontSize: 10,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 14,
        opacity: 0.5,
    },
    artistContainer: {
        alignItems: 'center',
        marginRight: 15,
    },
    artistImage: {
        width: 116,
        height: 116,
        borderRadius: 14,
        marginBottom: 5,
    },
    artistName: {
        color: Colors.white,
        textAlign: 'center',
        fontFamily: "Open Sans",
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 18,
    },
    artistLocation: {
        color: Colors.white,
        textAlign: 'center',
        fontFamily: "Open Sans",
        fontSize: 10,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 14,
        opacity: 0.5,
    },
    musicCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    musicImage: {
        width: 56,
        height: 56,
        resizeMode: 'cover',
        borderRadius: 5,
        marginRight: 10,
    },
    musicInfo: {
        flex: 1,
    },
    musicTitle: {
        color: Colors.white,
        fontFamily: 'Open Sans',
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 18,
    },
    musicArtist: {
        color: Colors.white,
        fontFamily: "Open Sans",
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: 600,
        lineHeight: 14,
        opacity: 0.7,
    },
    musicDuration: {
        color: '#828796',
        textAlign: 'right',
        fontFamily: 'Open Sans',
        fontSize: 10,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 14,
    },
    play: {
        position: 'absolute',
        top: 26,
        left: 34
    },
    groupContainer: {
        alignItems: 'center',
        marginRight: 15,
    },
    groupImage: {
        width: 116,
        height: 116,
        borderRadius: 14,
        marginBottom: 5,
    },
    groupName: {
        color: Colors.white,
        fontFamily: 'Open Sans',
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 18,
    },
    groupAttendees: {
        color: Colors.white,
        fontFamily: "Open Sans",
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: 600,
        lineHeight: 14,
        opacity: 0.7,
    },

    attendeesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    attendeeImages: {
        flexDirection: 'row',
        marginTop: 'auto',
        position: 'relative',
        marginRight: 48,
    },
    attendeeImage: {
        width: 20,
        height: 20,
        borderRadius: 21,
        position: 'absolute',
        borderWidth: 2,
        borderColor: 'white',
        bottom: 1,
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

export default Music;
