import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Modal, Button } from 'react-native';
import React, { useState } from 'react';
import { Colors } from '../../constants/Color';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Feather } from '@expo/vector-icons';


// DUMMY MUSIC DATA
const tracksData = [
    {
        name: "Millionaire",
        artist: "Yo Yo Honey Singh",
        duration: 3.24,
        cover: "https://i.scdn.co/image/ab67616d0000b273aad3f4b601ae8763b3fc4e88",
    },
    {
        name: "Desi Kalakaar",
        artist: "Yo Yo Honey Singh FT Sonakshi Sinha",
        duration: 3.24,
        cover: "https://i.scdn.co/image/ab67616d0000b27365ce8c712e4fb894bc88461b",
    },
    {
        name: "Makhna",
        artist: "Yo Yo Honey Singh, Neha Kakkar, Singhsta, Pinaki, Sean, Allistor",
        duration: 3.24,
        cover: "https://i.scdn.co/image/ab67616d0000b273a1c1ee1e4bdf81b17df2197a",
    },
    {
        name: "In The City",
        artist: "Estella Boersma",
        duration: 3.24,
        cover: "https://s3-alpha-sig.figma.com/img/2060/6678/09bd2506bf0b6b965ee69e4a575ff98b?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=R5lGlUgpMEzqy526qjHnbAZEY1td9PibzQY7TYfj-cDuqaAuWm7RjPlNdOvp6NFfpi97h8s8ENVIKlaOV3Iomlea7VfQT34CrjbqFfqvvL5fXr9jNw6wJ55Iafg4fqEEmuJAw9~BRgPp4V-EtAJKEbcAqwe2m8Sr~X7Cihi93ecF0RawtHAGgSv8KE~aXgnp0GDX3vDqel4gRxhR0t-RkRuc~sDXkcCJh-2oVEyQpuTTxq8IYBSapPXqVUhc2WB~U-KI043GckffyC~JhHeePTFWE8lTvX~wuVRHha-HM~gp0EJDL5~~YgIw2mXJkH7GxjIze2MVJ0Puy7h0tOmj~A__",
    },
    {
        name: "Phonky Town",
        artist: "Estella Boersma",
        duration: 3.24,
        cover: "https://s3-alpha-sig.figma.com/img/806a/2523/b065345961d7819214833e43cda1a2e7?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=TdiSzdo3XiF1jJ8Q72kq8Imi8XsqbvdcBbjRZsll4j~ulY-ZZDu3zI1EeeN-Vxy7g~BSAf7zHlnQxVWXtN22n8tPsnY~I5bQ7KjDGTMGcouwTibqxjFKpr-Zhc-Nluux3sUg93vPIRnT1N7r1VMohT9yUEj77dmrxOkasavjRt7vytVzWPHmFf6v6N~OEOG~FnQ8S7lByJ-KC8HagF7IcFxO-jsZgf-zU6RTd5iAHlwDZ-9Kx9ne2AKLw6y7UWAtWvr4xB1u93Qb3tG0lyOciqkzPBOQ5oMB0fIGeE4q8YoGHKgOPb-YMmixSzQ-yJnw3F0HQINSP2oectDDVCQf-w__",
    },
    {
        name: "Made Your Mark",
        artist: "Estella Boersma",
        duration: 3.24,
        cover: "https://s3-alpha-sig.figma.com/img/66a5/fb4a/dba97d0cfdc40b0a75b72f80a40c30df?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=fKVw7YT-kye5LZruH5msITL5-sMv8-0IggBwMpxw8wz~3LBx1yIYEZyyWC~01GsdmlSoTXn1UxvwGvcWUI8tVTlqLVrzLAinXElww9VoclocZJ05WzCMtTpOsGA5LCOjYzmlZgvyEQj9s0-1OSfiTagYQloakjmA4ZMtg7K9s~AjeZ5OoWWZ6fEHKuY9AlOo1EfEtpwcQW1SSHdtkg20Qc4950qTrPwuC43yIl6XDnVgk0CoT6RCPxgt0Sys3UY882QH57DuEfa8I-I5JVFDf5cbuJdjCm57RDk8At-dUPsvG5QogYRNcW5zStrBJI~y8XyZvDASBJqphfihyw9JZA__",
    },
    {
        name: "Solipsism",
        artist: "Estella Boersma",
        duration: 3.24,
        cover: "https://s3-alpha-sig.figma.com/img/f6dd/7044/9bba3ac5f118525fb4defe4262360cf2?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=GnMCVaJBqg9nxQxcEAKpqrD2Jnx~E7v-PuHWK5E11-qepbNhNgD44fS9K4tmjCU7Hr0Y8u7jTEcrRAtiDWKBKsU~UIo-4CMwSDUhX2YLIVnhR2YSnPJXANiLfzl~eHPa-vcvz9lRl3cziZwRPEiuS46KCIkgi~l2VAmRREeXi4g7ijh-dqgi0uFddYmRX6azfo80uIbx3I9nW1UKzbr9mUSMRfJYVL4anMqMyw9yx0XBxos9WzeZfMZWy2hr3D67TyRwEnVwU45pvP9F9mK70U4Q7uY5dgPOZi1fx-QQ-EB44v8P0yuGLqK5-R-IlxYv41oAV2FPLB3SlVLgYVGx5A__",
    },
    {
        name: "Maroon Sweater",
        artist: "Estella Boersma",
        duration: 3.24,
        cover: "https://s3-alpha-sig.figma.com/img/bb93/8e26/a076118cc29175fe2958bc97c7f83e54?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=OWaRGHiITx6VkXrVeu3RuYqLmNKA2iTlfR8XE7X1hRRJLh1nIiE9MUOE8Xrmyd1KQf4jaskRMxYJHqRLxNyjdbwqkviOWeMvGNHcb0WH4SiI73MzMCQm0XGageqNZ46LQRzXC9AiwGaIyviDDLJmSGk1ray7biVWrf2CI1YUKygQp3Uw31mrLek7StKgJ7KSHhgztE5SaD5mlTDqkpbgW-XdYjPVm64BMmmBRJrcTZ6Yq-wORP9RxSGCA9kDGuOFBkchFufeTEaVu5D5-hZ9OIF9HybqkMwDhXBy-0hjyfUmbxv57xhrO~w-Sr1nrX-AeQQlAhKtVp0MS2z-TtsAdA__",
    },
    {
        name: "Lady",
        artist: "Estella Boersma",
        duration: 3.24,
        cover: "https://s3-alpha-sig.figma.com/img/1d7e/5db0/67136b7c0bf8215dc6b839278fa61f4f?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=bJXbFIybjQTb2l4X6ezjORWxPyXYgnhneLuKacZWUowoBCXcd61srXF9kNXir3CrtcJJ2pLoD945xnA5m8sFfup0DXxPgO468UPZGdL2F9SuzukdPYvDoXAXJbn74d6ruluCz4IQYFF6pSMHMzLY7Sy5cqndjnFaSR8alt7m4cXDsGYFSKeFSQQ9ADLoxFZkVr24izVJR8VaMczVBCrVAIupaEnUHOPK-iEIsM0o0xj6svMq8a8tqc4rSE6mJLGHjJYbeDlAGXyypNvW1oqoE6XQGlepUHGmgM1ngDxUSc8UuHuw7hYTmKidVM8agjB7HLaz4YWMSSQqMDI5mF2V1w__",
    },
    {
        name: "Yearling",
        artist: "Estella Boersma",
        duration: 3.24,
        cover: "https://s3-alpha-sig.figma.com/img/25d2/04ea/433fa7243fa79155f2dc3418f4e1c05b?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=DD9q73TzXe9TxBfJZj9OIgg0yzDTegy1QdJFu1WBlmXbS8gb5rZyzJW0AVxRqNtMLrFVIad2obbCbwtEhJBxkM~RlWFx0PWes1DFp-CoEdsNeg5Kw8fi7HYVOIhoZY2QkFueWlMTTSjbuGEeFDrKy5LW2UnAfycI6xuibVcJtybFkMsZd-LzK7m-XpS0ExwM9S-srxxZbd9DJb0dox3IEi7jBm~9nCUET8rVVulosRaelMrShu~98m2xke4ETGGJu3APjc0Oj2LN0do3A442eEXAfaMKbk~TsYf~ArLzvDkZpJ25-MyB3nPEdmV348~hCtvMq~Aj-kAEuYVYkrfhYQ__",
    },
]
// DUMMY ALBUM DATA
const albumsData = [
    {
        name: "Tunnel Vission",
        artist: "Raftaar, KR$NA, Karma, Deep Kalsi",
        cover: "https://s3-alpha-sig.figma.com/img/7d48/3c55/9d059cb8231b2d81f479611b9aeb8fad?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=lHbfNuAoyVTsmja~XdwpalrJTFeQvG-HIAJ~BRnVpk5sF71eX0tO4Xx79cBDeEwVl38lCkkD47dmIxsC9iXeZ9uF~Wj6-0rwp5sDa6cUKdytK5lmAtBDQAb8nfbtE1CHoyLLh8bYXx7hssSyXF1U53XO5vuyEcunv0m8a-cmkVGdvtZlqYhi5ThJ0M7SEDsXoOWe-XYR4FjdqkWHEYIrbtSZYDmVdrDLH73neJNGO74FxK6uZU3VHsFe9GaZ8CHNJtFxL8JT4TR-fVrMVziBWlmJvqxOWL9wWoJ0DbzfAu71KOmmMWUcRq9dA~~wvM7nucNfdnzqvzfKdShr7f6TTw__",
    },
    {
        name: "God Watching Through Birds",
        artist: "Sikander Khalon, Sky 38, Al, Aghor",
        cover: "https://s3-alpha-sig.figma.com/img/ec33/ca62/de2d47c7b6dd3040f476699b7d2343dc?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=bWmGZJ9XBqXgPQ9rT-u1zLkIS0fmHraxLbRve62tqhkqMqgqfEQ-jhetIl87RCfG~QIU16gqEarEWFHyFHteOBm3oeMzbmbItjPfRvAblwuR0H~~DIvI8xDztDyBi1ZDnqKsFfW9rDDzfqABgUdyhXlv-1CORRZFO~gi~U-uW~1yjmtuFxGVbe6hTVHGuIbTnIVEL93q-an5CJ8G5QD1V7e0lGC6kU1GvdIQm74wDBracidcdPOg49DiwcmLbCPF7IohkYLPVWVxPkF~3~pRzkiHyrMRFCahzAW0IdqUdVxS7uSfIfa9WsjPsca2o4-w4LEXY3bMAAYBe~URj~QZ9w__",
    },
    {
        name: "Breakfast",
        artist: "Estella Boersma",
        cover: "https://s3-alpha-sig.figma.com/img/9183/a935/b56c416baff28d106397b1d0629398e9?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=PFHv4UoR4nPngF6bam0jrCwjAO67nhGuodzWUrUlXwxrcgsJnKe3klT75xszm86nQ3fyLYtvd32VkIlHSewwIMVGV~nEh77kq6z2ZV1L~iHBj9EPdNdRSAmXxt2mtj1P~or4oqpuzV8UEE8CACyQ81J8azrSwBmT6uHcYRmwkjmrcLK3TVP4B-ijxefNNAe6-7Frz9D0934KMmW1xGvvRGRXmEl8wtN4fnBmRHvybGD722hubZN4syBVKr-fbRO~lWLCVQaQnPxt4Jpy8xrZF4OnyL7UyTO7sUbCjXY3XztMO0bcVO7cE6cnSKMYyTKFtd62k6oq-63DsbWp8NGmnA__",
    },
    {
        name: "New Age Filth",
        artist: "Estella Boersma",
        cover: "https://s3-alpha-sig.figma.com/img/44db/6770/c2bfff55cc9aadcb2f5ca3cebd96c84c?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=HHVDe1xgKtht1byZpGWJOb1SKF-FEnjbhri~7czE0AgGekIToJraoahOeFOtS24hrEqZwkjaielMwRUDjR9ZN2WoRXJC6TECSFv4Eav3yN-Hq2G60U7qVaqIjQ1IzoUYREUKiG1srCsVS-uo~hfdrxdYjhiRAM3oQke-Gg7SZsQCVFh3uupQ-7ih3a7F~fyzkOx2UzKpUsb9JgImwmHFyDvjikRiGyE-DV4JLnbSjp3bbGf9tfT7xah4Pm3BhVl2wJ5mcZmarEFlAx3pA~dRsgj1JQOpsyTqObmQaxetFRIYwsPFB3TsqmoMAar4h79q7c4hoijJFM7nSIazEA6S8A__",
    },
    {
        name: "Mental Knife",
        artist: "Estella Boersma",
        cover: "https://s3-alpha-sig.figma.com/img/c060/7daf/551cce388d63eafebc2c841f3abdb06a?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=dOMeR69bs3~lhT-hgxPmpvSP8hePUy-TTT9OwVfViMA2i-llFYhrEpXUEwEjq9054dpPHjRYz5ZRJmFN2HxKHjhLmjUwOgI7dSYzFZF2LVSULa2GyYR~xlFAkK56AKEjbvW4zVKoXSVXWhnY6CY7LwDHLyVJYpCu8t285RTaP52SAqATJlzUNbQ3vuquRqBgFXki4dtBuzKazKgSkuFcnmK5yxO3FXmvfNLTe~lofrlx9UB4LO5bBjsgVHR2ghhm2ZXGrYFoP7yxSc59IZghslVsB9XGLyr6oLrKhgNiXV~6c20PpH3shsbVJZeLQNJJXGmbuHNS355XQOIAc4EvEA__",
    },
    {
        name: "Wake",
        artist: "Estella Boersma",
        cover: "https://s3-alpha-sig.figma.com/img/59b7/2dee/18aae40450f99efc93f19bbbb31548db?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=JAbmaApqumIka3-wPjhhYOex6WtAi~WoCMhlJK~3rWAGmFO9JGNNhi0d7IzgsIJ4wJbtXybHmooC712BcOBuBV~ywIGh8J1VtUuMlMyk9CsdNH6tLwEkQW2Ermo2VNZ8qGvrnwrHziD9Z8xjNpThwnds7eZfTzTZo9OLJ4S~y~Cd-erC9FnEJlxMGss6DFaPqE--epTF0rERYQcwiJDU~Uq5aNcccn3zlGwdVlB8bdeu07RW6bOTE3Fq~bBhUphUYcLoRUc8yv~uBiSKjjw0K90XgNd226AeqlWKJSx5-6eVq8NLVOVXIIn9wgNgt7AJWhocGSwTFlKYXzeQQENubQ__",
    },
    {
        name: "Culture Scars",
        artist: "Estella Boersma",
        cover: "https://s3-alpha-sig.figma.com/img/c237/7898/e42a269d3d9062304a50e1e6aad52642?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Ta5IJP4HfbH7VKDa2bjlJwm4cBbzJTerQvgnVWIKjzEzgCTDWvF7T-jxZodBbYBGy6BC7cn3ffqKITqfRBDIBRLfQEO0a9T7UhCldopxCqDPItyNzxap9AGCl7rmfrv2q5fsmi45nTUJq4Eq0nff5jq2V~iEGq2t8CE3ugiDhX2W6K-ogGw-B2u5ujnqAJL2MilgZ76KCW5pESeyBl6ubn06Mf6bpj5Rs7Z3Qx5IbPKjKoKBGiP9hUKMoO6T9mKdZL~FImr72xdDeLlEKfllPim6QkpWLtj4khCWermrN1kiZ~1k091Vqhw6aDgiYO2PvCz35E4dUo-5GjOv2FHqeA__",
    },
    {
        name: "Fake History",
        artist: "Estella Boersma",
        cover: "https://s3-alpha-sig.figma.com/img/5529/4222/3449e90fad752a465407e57344c83fd7?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=IQgXxip00-XZjxhLLUnqGjscvO2BWI3IAMaQoGTdPB7YAioMg6Kj2DbSit2J7v2l4SHhBiSMnOHqmzT9x1~5UpI0qMRCtxCCKrhxG5QDGvJu4A7~p~RO8zmZQR3ORq0R4hrMbofLuOPyv3hiqSxUJdQJ~tA6OTfw~CdrVe8Xyk-FHT5Izqbg2zdzYs8oYSKs9gs3hmXosG0J5KhDPHB~SuNwM4UJKOSut6VwihJ~8jsnmtPgzaP114qEen9p9OOB-HrBwpSnEd5X4oVW8CvtgYhdRiRBHivlKSHQIDy4coaMo2TiY9SyYY7NZ8dF3DhJ6pAHnrkpyG3hyoyfO8cSHg__",
    },
    {
        name: "The Best Light",
        artist: "Estella Boersma",
        cover: "https://s3-alpha-sig.figma.com/img/c64b/8253/96b4993c444dc20c4ceaf027e006a70a?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=VOwE5iV1JpneFYTRfxwFIDQ0VbluFRjqK4yfWv6mQAWRV8N50KrEKw-wDvfCg-sxrP8pbz2qsAjrW6c249q69GIh9twSr80iI4k-t76xfM0txG~e3pCbji1kYudIxIyeHeFTEKCcpFOPhMCeIcLarhfOGF1i~oejrN15aS-P9UYibW~PJSc7gLQJ2AX2r6Z-eSabGzUcFEHo-ZyMKtawWrs853hK6aXTd0SARz1X7w68T0ST4LzFZYZ~9EmEwLh0Fu1S-0z9C7xJ525nx6mhRac5soTV3JzZN-e3PhzceqNSancs3jPoGAdp8-6t2LLB4WaQmiGqE~ZkA3bus3eZ~w__",
    },
    {
        name: "Cat Company",
        artist: "Estella Boersma",
        cover: "https://s3-alpha-sig.figma.com/img/a5a2/3dea/5c2292b5120e9f48a1c108d6b019db89?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=o8n8ptKCCZxdSHwKRnG~wtwmqJ5VC8SbgmFkPVtbbG6Ff8u7Y6NkfpzVZz5iz3TXitoJxeeHUKsTR1VD-V9Sr-UUeOn7LalXLPkGqYqAYt9w4HXsIVLoL7s4tw~fFebf-UEPKBYGKYlSm6YsNAQVz5s5oY1Q3uVmiP2PjtiOJj7Qj8mik00P1m-NAYCOrsasFQtc~e-ecnWU0w282~i1kv12xpRiZY7~y2FT3hr7SpkrZebFf17OpcdKbm8cqC7uZjBPTwoqqslzBTvj37xspUCBfCUGAFf3-jLSlSkNNgAzk9s4L8ZJCIo4nMyL9v9p6Y2mvQiDfi1aTVt1AXSQlQ__",
    },
    {
        name: "Outside",
        artist: "Estella Boersma",
        cover: "https://s3-alpha-sig.figma.com/img/5a14/238e/4d51dd0ef8c62c4b32744faae67352ee?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=BsyF2Y8otRJQ91Vrv80Vq9GwJyGtzbtKy6XITyCCkKc8Kg53gIiYX~L9joYLgqUNta8Lg~8lUMFtvLnXJEpIqc~lGVacaf54JhFdHN~KT~yzpyiUzlVBop4ecp2dPi2JFVLNxh7EEhojLvkNnJECsxRSH9aD-qOQJtTy8GgJd8V5W7-8tp64-l4s2UX91ErwbAPcx~-DPX0v~i1cSYT~HVUTF-ZI4So7JSI-RrgJDDfg5gWK7Ajid-cBmWgyzYtFlkuk6wfMbNNCfvDPBGVtS2jtnOA9IGVBTheXhw~MVFmVdnJTpHifPBmqGRyaYpOR82K34no7GT5-1~CbKKUPAw__",
    },
    {
        name: "Leaves and Roots",
        artist: "Estella Boersma",
        cover: "https://s3-alpha-sig.figma.com/img/e5aa/b9fb/7f00bdb1ffa4c92aa021e73fe224eff2?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=MVQY8Om4lBup1-Hgeq2~kyNZUxqPSW63QaU1Zr~a1kdeEDteqs7ZnhMyBHOSBeRl3kmiYjtRPB~sjtawzK2DvLVXYjBv59q9AdOiogVvJdSY3zPenfLef9in9q0cBv9mHakb4ELprVQt2gbBraBYRUp2d5f50wQMC2mqqKg6OmqV03LqRoPrAFLbYW5axx8-aznGeNurWu1czvf3fUAymzCpd3T6DNaATvJ0wJRkHV-jdS6oJZC88R8CIMTzFXbdtbhZbyUG1QZHOtxePHYXvtZWi4WEC65I5PmknDDFOvPNlEYsuOmJI1urHuqPQpx5OfH0ObmG6RiaxhcGrAIMIQ__",
    },
]
// DUMMY BEATS DATA
const beatsData = [
    {
        name: "Beats 1",
        price: 30,
        cover: "https://s3-alpha-sig.figma.com/img/3f5d/b8e2/ffebae1a8f9c4439cbb0690103ff4ac3?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=hH6q-3-DIC3nDmae9A0m9v0o6PEp9NenvrGlppxaBhPkwhRX3lj5NHvvjvZuaWHgWN1QdbqHYx2UJ4-VWH6gWiQoCJZUEDD4MQjwVTJ-r7am~09s0PCwZBN4CDneEjHkUT8MK2KnUUQAG7uq68dJXuEO1RkFbI1WAdTTNLoy~FZTvYdlDzLpDjtRaYVxqH2G6CKW8JUtAGK5DdSMbkqpZwJ~8s6viRcRLTI8RNv7kqjcwxUaC4I2gu6q~zogmTA1kOllX7G-T6wWc8TdlrU~xyxgvyBF6hC7YCBjoP~5Dcd5WNG9MlYSSHh1YRO5uk9BBf8j6pWdNcagwziYFd10sQ__",
    },
    {
        name: "Beats 2",
        price: 30,
        cover: "https://s3-alpha-sig.figma.com/img/7e18/683a/fad940bfff8bb9508cc38820519d54c6?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=a9d4eEhHWZcVBASsx5AXorumgd-ViX4CkmDMnf71c-lZEl~68PQ4Ql8RRU8gwdq7Zr~fJ-AREq9B3mB8iTEWfW2cJIGQ9UiJOSjSQzVGEus90Mn3ygrrHYU6S8Z9aya0FmzL8I4COfBMIRGddCY0MZHBHaf~-~-hXn-aR2C1Y45pZ21c2nNS4hXceFx2mCdASBpS62bh~H3i~ooGTDUmYmGKmDpXSqrYbCytYbLbuZStxsn2HG~N0qvRDycomd5J0QiOLBYGZSSTOLYwTqufvMfVyM0fg6xV062pdpVjuRzS-2SZoPxCxNQogpwVYcZCs7tHDVqUhYCN-o7DKvaJqw__",
    },
    {
        name: "Beats 3",
        price: 30,
        cover: "https://s3-alpha-sig.figma.com/img/91fb/0a68/e73e1d530ba0cc7c6a4a9bf5ca52ae79?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=odKTSorJZPuC1iExtZo1uOdeYMNy~tftBpOmiX2x6090KuACpnqxpluGacD057AT9OAGDnmZ9TrdbPtkXw86SMfozkZnWbhz~wErUy1G7mwvyGkoGSBoOoQYqnTpIvSWhAJqcahLgeHbDrc06mA65WzqAXs9yajy~l6pQzUB30y~SjAbvclrYQAige4xAut3UIHYBICtdWsq83TCPrHaVMc~p5Po7JH4yjlrX~nZ3nvkeWVZapjADi-VxHk1UB-yOQhId5hCtgfONvb4sgPQc4mWFXS8G4B102El4taWHpEIUlDxhcGDSQywCW-CUd8G2u-Cx7SJ1ZLwr08RucbX2Q__",
    },
    {
        name: "Beats 4",
        price: 30,
        cover: "https://s3-alpha-sig.figma.com/img/91fb/0a68/e73e1d530ba0cc7c6a4a9bf5ca52ae79?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=odKTSorJZPuC1iExtZo1uOdeYMNy~tftBpOmiX2x6090KuACpnqxpluGacD057AT9OAGDnmZ9TrdbPtkXw86SMfozkZnWbhz~wErUy1G7mwvyGkoGSBoOoQYqnTpIvSWhAJqcahLgeHbDrc06mA65WzqAXs9yajy~l6pQzUB30y~SjAbvclrYQAige4xAut3UIHYBICtdWsq83TCPrHaVMc~p5Po7JH4yjlrX~nZ3nvkeWVZapjADi-VxHk1UB-yOQhId5hCtgfONvb4sgPQc4mWFXS8G4B102El4taWHpEIUlDxhcGDSQywCW-CUd8G2u-Cx7SJ1ZLwr08RucbX2Q__",
    },
    {
        name: "Beats 5",
        price: 30,
        cover: "https://s3-alpha-sig.figma.com/img/0f73/35d7/f5da85bde7096559f3b7cad6e0c502f0?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=GCruBOwa7RAKypKT8uRY~XZMGLwgTuwqkal7oTfxbeoLCP~ajaTMgWq2N8JhwrwmSIdgrIryPkrYRbxeaj7WtG6aTLmErbE2JcKKxvAlDG7fgjYs4GhoWOiMbZOTZBjMQ9Wz4xC8SXdrAXgv-qsEcDMHggP7kQfq4OUyvq3cLGo01oI1E0S1yz~TtE9ya9U0ILKJ0xsdhleVttps4Byqqh4RqfzFPrQ~YPgSbRZyBkrMd-~kgJ-aUTgYj4ruEdn6D7cPhAiNQULaA4NPtC33GGXZt7HjRnWsEvFF9rb5dxaS8p~xaSHZxk8yNX0A7PIZPioFjvMpVtyj2L-X0QShow__",
    },
    {
        name: "Beats 6",
        price: 30,
        cover: "https://s3-alpha-sig.figma.com/img/4eb5/b46c/6a0e7948859b1ba7d0d09169e4e28a45?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NJZrZlMot7v~kuP~Gftzvg19tL63Tulr4To0QJ3X7NBrdX20IC-VFcP8i-Z3QdlaLCsjqM7vbQeMUpaBd7b~T9DgE9tshbdnEj405vNaJ8BWLASxmDpu7jg6IlOMrQLvpTGPKLVe7zETb-PqBGMnNMuWSLl5~qqUNpapbWpjIC3vav776V6wDfEOyxcdFq08cnVCh9Mc2ZUfcC5ClCanHccOUDW4HY6wjMV6RPl3VWRr91mshlo9Ua0hrXVSmOy43meRYxsTp8K2UwOha63nb4E6CBNLoFvmHSwMB9~NL6y7s3DrJ4v9L5O8IJJ04GnMwmNRlFHbG4yUqzCeWxS09g__",
    },
    {
        name: "Beats 7",
        price: 30,
        cover: "https://s3-alpha-sig.figma.com/img/a63b/1c5a/cf127bb7e9d013695a8278988aacc08a?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=A0kOMwzTsM4wdo0wULQMt6eqHRS9mduRh~Vyz7UyfRU5XFIqY-sp30pSnGj-ViP1I~SdEqth7QHzjBSmFXVYmo6rniwTBpeULT2bPlIjOjsIcM8i6FemUXZSYVWXZ1CR7PoD3jOpI6jKumSSxTXc7i-FuscrHWlO8ZyojB1uYLEf7a08RTisT8yCrvQU7PeaJFQq7jl74VA9Esi5Nb-H5LZnyQi--rLcjkpNM7moMLTTBYuxK9MRqNU0ZzE7Iqq6G2gjH2MjGbS8wJLM2bXI9KeRKeb2DzVq6mvC-IsPs3GfIVK4yBuWXzLHltYDpk28t8-DRCAG~xjhZT9D7hC3ug__",
    },
    {
        name: "Beats 8",
        price: 30,
        cover: "https://s3-alpha-sig.figma.com/img/6190/e587/4c0f9faeab9fb4f399eb7056ce8a088c?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=bKy-IA~dTbQ38kUhmuOvvplw2nZKFKDPfJFb~MuM0mL8rhfwuNlDAPt7ucPMzNLipgc0obyuHgdfKbYdwankK3oAH62LQDB2XbjDBZFXvXeXApaFcuaH~lBoZwJ72QHmVBnrCgY7~RCduJ17vBE8SJC2CNlNCJ0y13bLH0TNpG9Ejv4gpLZea7FkfYFshBxBVHODlmKeqFk8ifr3tRalPGMaXgw8t~6HcUf4xuLshGO8tKHeukp5FghvxhPBHjf1MDx7MBdzUNJDwM5mGv6ZOu1E2iV5eGuI6UTmJHM1gRfnLKHD9a4lGljgV7j74aqie8YWUTUXgacofm879nn9qQ__",
    },
];
// DUMMY SOUNDS DATA
const soundsData = [
    {
        name: "Sound Kit 1",
        price: 30,
        cover: "https://s3-alpha-sig.figma.com/img/65d3/636b/ca6e7d6b7a3bdec78925c186472c47c4?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ahVBIxJ~fez3jFKV79WBZPsnt~krDvGyELAT0pPVWcv9AzR7RMnvspZAbnEtHH0tH6zZYaPWsM9hbzQIzCPLhiJdt5Mm4iz-a2v2ajjCftufV31gl5AE1oKgSY02CXZMiyrL8eES3dl1FfhqwYDrG17TbY3JhoWD2MBzSAwnBd61LqNAGGt88jz6S96RlA5NC4oVY7KRjOMHOIMLB16GIBZcuEAL7BhbMeLu82Lr8vHi0B62VuYOiSW4UeEyuYw43sm76yoS1d17P25TUG1apUO7sO6fo05a~fm9RUVnjV6yiaX6149Nl9zxEgadWf02-hjVvNV9qWMPHek7NQr8zQ__",
    },
    {
        name: "Sound Kit 2",
        price: 30,
        cover: "https://s3-alpha-sig.figma.com/img/edf6/696d/196076f343bc47cf277b71bbaf622c2b?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=MEmCdnQmrTS1Lj1t0GgwKeJHXVEKRURWF8UDdu6rTkLKLhwETSDd0-9MgsPYEg4XquewDBEHa7ZE5-CgdfDV5yTImngutwx1PZtdP33YNUcZKRenxEtC3HxcXqD4AuSUgaPhBLsDNOlDzwezDedwClEJAkYcy6eYLMa~avTNDFGvIUgIk7wQquTU2PTysSNw1sdioa6zP1GbVBjZYPTeAWBNc9EqH-VjeNJy1qYl7oaNKBezgHoEeRq3vtnuTVpvj8NPhDFg1jd554rFPdWV~0k3qUb7mnmcRONixEtqE7OYqX5WSdwDofdmg5sekhwfETkxr6jxdYS5mB-o5LnMLQ__",
    },
    {
        name: "Sound Kit 3",
        price: 30,
        cover: "https://s3-alpha-sig.figma.com/img/2c0c/0708/6a3aaba78b8e1cb88166c9c0f2cff835?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=poAXV9tAZ~gF318P~l2BbQ4Y8uadYQrJKh74qV9Mv7UZ0nxRZapAdBDkqWFqeGmiGhTE1Nnjjq4RclfDvQlHBBrSn-ZpKor0OB4xqhF8OsOEdUCWMwwD7Ay5g7sW82utyq4sp5-jwNa9ZbpqAy8HxJ2Z9~qrcq2h~OnRty78W9OHjLHph26UsxwbppXnzOvM2dNrUWSSvwLvoRv~TUYVYu0n323XtQ03vQUMD71CTQlTLP43SpPM6C2X6WphlTTi2AgUG9lFfyyvxTQcHQxRgc3I91TbTpuu5rr-0LECOuI3x5pVdtzctEq8HaRXwWPXzWdfg5ySKg7LcUOY1nWkXQ__",
    },

    {
        name: "Sound Kit 4",
        price: 30,
        cover: "https://s3-alpha-sig.figma.com/img/eb89/d6af/aa4ebdc767a10c328a449217719b2af9?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Q9DpvLN7X4oYEJbxZviCUecHQT0ASWyWxQk2TXdh1KuFhJ8Z-Z5E~r0UeqxVjL~chxC~bu5YITg4taZO3HUtda37D6BEK~RfznpH3lUjOxMtUvM5kDrgeWHk8~e2IEzogRqSGwaoCdGk8PlUDudcXGROfeoIjytbdEMUm9Iqj1CkATAgFz-FF0ycOF3HaNdSk~WhaYcmQvan2NZzPwr2qlgF2FL8TRGYCNcBBAyE98avunrHkupEaFyZp3q5Klz7X7oVuL2W3DaLAdpxUsWOjIcbreuYGgmWz2uT5mWZlfh823dKmhUgvyMvgaNiviqPtEScWMM0iNz0FI~zo4CZqQ__",
    },
    {
        name: "Sound Kit 5",
        price: 30,
        cover: "https://s3-alpha-sig.figma.com/img/3ec9/cf55/97c532dd362d662d8c32addda504e36f?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=I8UWTsEAyYG-3QrMx~Fuoiw1mu5UsjIdH2JN3TH81xlBwaogheFboWICO5-BG~Y5jNnrZog8yYpuhud~gZxrlXkklvfp-tE8MyDGZ~G-mXfmjaAY0qvppXIb1mSXmnaoqY~GC2KC8kS64rTetafs3~FhiIUbXSqXJdpwdG1zTMJ-uZJwrKjOLvoeohbECc7C4qcb4qIhW4T890HxXrdky9HigUyH7GfGwH2f8cDraMosFL51rZvQO5zikLdOXs5NwKzf4kY6zFU7LANAwyU3tOmgPKm2E-gbAbSDQGa7vwiL8QXSjLbquhEii1ngS3RTuNY1GyZU08OCxkve6-2egw__",
    },
    {
        name: "Sound Kit 6",
        price: 30,
        cover: "https://s3-alpha-sig.figma.com/img/992e/1a7d/7f3d6dfb35d1ba49720db1c7dcbd8e9c?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=FlXSPeHGi1Of6tw3m7unjRNN5SAiAyB9L-Kb5g8rMb~jG4nsA2yDmExkeVsdolBHHXfZPc8KOj5mZtIdRU2ccDMXWgxWsCAMHPmlDJfQXLHl~jahwXM-JdPrvtzaKG2vHg21yfrjCxLDAUTYF6j-LDdOl2Uqb9-44tC64TR7wn15uc1pGvYvwI4726eHh69DHA3OFfOgE5CVFAkegGPl0C4ukgeA9O9LmDxKolZrR4pP0HvnW0wFowYlsr-cmJXlIcrTmB~PRO58sQ1RdVzr8oAMI4Inj~8wFK3dpDIYVB2dcJmwoO6H-GAPw5NZ5K3VZUqS3tX7QmqJARk0VnS0aA__",
    },

    {
        name: "Sound Kit 7",
        price: 30,
        cover: "https://s3-alpha-sig.figma.com/img/ffe5/52ef/ff8a49d8f3d3b27767f56df4b104337f?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=p-jHCiU8xAVTyDKTXPZO52Rm0NRwoRhS652vjvVn52zdu-EhMdTcu95PlfW~LBmOKEwQdtmAjM9x7yASNMoudN1E0BkDx0O2hfo1LWkwP2WMFeTZEHmLZwQVM7jZb5jmFRTO67dSCcascKgXiJGLB6aGz7F3ykjzKptqC4bOINm0O3DwmTnKqmgZUWx9tVUbJJhiwIaCulN-cdYwir~QTGepGeIvhTAZsy~A~-VMtuTaEeRUGOlFhvJ0gvspVc8qiJjT~mySFVuFQB4-pTj1GB~pWMtuzzdJQDmxx4HTPX7P8dBXi4qtZi1Y6u38nQ1EoYwR53-UC~q-ztcWd84zNg__",
    },
    {
        name: "Sound Kit 8",
        price: 30,
        cover: "https://s3-alpha-sig.figma.com/img/ee36/4a40/3f306befeea4d06c18d353d0759f8942?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Ob5d2MQq~Lmx3SjQW7poYdQOgUKwMz2w5rRk8Szl8MX-QayfTwIXUljIP9CByJ44mRLN84~kB84jigl9Am7wUZwXsH8-L~tCYP9DDHE~YTipKVVY8satyvKS2QqWmDL~50vdoaA4RnkG23yevXOU2y3qbc7CHOJPQNIXMXhdFZQtHoO2A7B-kWhtJVZ5rhp2Cx~VyeL5F~JlQVs4YKb97icRszMn~D-5VgbuNwQle2tzcZx2vKbQuapgwe5McOS7gtG1ZynsGkaqN6D-OI-gRBxeqcM6312SRkJyy7EhxrN9qDfXS1REak6hwH1j9FWX9N26F3a1sMetNvWZapguFQ__",
    },
]
// DUMMY PRESETS DATA
const presetsData = [
    {
        name: "Preset 1",
        price: 30,
        cover: "https://s3-alpha-sig.figma.com/img/6711/f55d/f124481db193ef9e2265176b8ec872ba?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Pv7uXyD0-ninQ9k3-Bn~Q~YHE5Zr5j4ql8IIfDjP~zQZu7ODi4hSuMS1LB4YzBghlVQZbppTYQgcG1qTrk1a5jQO61EySxid-JG6QPegzz~0loYTX5ZE4xTC6O2S~bQ3W8bMzvvdBhC50zQLHS~y4pehss928VXI0hhAT-wQHQxOpqeGrixUlaQztrr1fkPDwMtyRVhOXirYq2jTB5cUzjUqZExqJSPgbkFr8aWi1a3ZoupxUWK8ullx8Q09iG4DW1-qJiy7TBWO6zxbRvJED9rn3-G9B8XIF21~SMafhsq4HReO1CszBPJUl7B1Jr~~rQZRt~UAwzxG6HstMqqtbA__",
    },
    {
        name: "Preset 2",
        price: 30,
        cover: "https://s3-alpha-sig.figma.com/img/f0b9/1533/5920573f8bbe3144656525ae5d7c855d?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=BUQBluXcDbmQ4eC~QVo75UJya~tqiscQ-m4xW973WYN6ycEpQsSGOd9AGTWNMab4BM-MNHNtSzXYKG7Y0BEz6ef1EZQVBYbyleG0Wh~L0VroJhWw2X545~BgYpgMoDZETCDPUCBtbVrFNcto4VrvDwAl3Qa-C2EN56GwZYNddehnQZNiiOq1ZR29Ws3bO~OiWlKQPs3VHDL3kA04FxC18Lh41oSWyoBIn~WDtF60DIkn4PCmFHSvetm1pME2ArFStdBRwsXNoLw4cbpj0baS~GXWRL3ns5aiREGR6HKTAM7vSyw95upIxrWdNpiD8Rwgnh77dr3H9z~rNjFoScZyDw__",
    },
    {
        name: "Preset 3",
        price: 30,
        cover: "https://s3-alpha-sig.figma.com/img/3e31/c9d9/1393edc517a22b0bdc17fa3aa9608314?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=O8XH0m3llABvTCTxbg9KLVnbk7NadcbXkg2aEV1~qddKSQq7ojbWw-nKoA4HCKIxOFNgFlHHodFh5ssL-FHdTKmrlaxz2wbMZWuDhdwO6eyMHbuoI3KuhezrZ9ZaSShG9wh-lybgO1NTWsxhjZhqKHr0jhXQBiuYPsHp-PmDxcwZkcoc95zyNsVGuh2CI8Te~O1KakqQb4nrjEqiwvTp8Ur83r30lRq9T-6V~ys4mePg1o6n7jnSmXKXzCllLU54i3ZIOjChlcBUwQ9UepVp1BYUHRVdwH-xXDlcqW-E0AGIgGQzCsp3~miLwOQqETBW8~xZoEmxangNpq9rU~2bEg__",
    },
    {
        name: "Preset 4",
        price: 30,
        cover: "https://s3-alpha-sig.figma.com/img/3e0c/d395/7535a1eeddf49d6352d9d45d77f45c40?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ORzG-HZIATIUY-unthKv6EQaX4xFwGCvkhmge5qdBBzK5w-aRfC9ctkBD6QZ3eexY2s2rPKvRF5cckpPpVcG0CnnbmMx6Is2QYPUFvkiryWAj9-HIspBnMcWTNtlYYZLtEqOZvTRtA6VamZ~yxGvI0YXrrS6XswK~q9q3BUW0JYpr0ux-ht-MYRL3yHeJefF2cdiCQ3n~H7oix9ZDA9EyvuRvh0eF0vflfRyApOk05Gy22gnv3VxD6ppxflJUdaDNoLuEGpng8HIVeW5fa2oSmGq2gLnk0fDkF1bDpn~TPfvoGCq5wPzPLFdmPtVOUo-fOjPIuLGPvtrrw6EQShZAw__",
    },
    {
        name: "Preset 5",
        price: 30,
        cover: "https://s3-alpha-sig.figma.com/img/4990/7145/df16cca441bfdc13f57d34a72ec6f47c?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=lHj4JrM-iJblgZp0WDL5OHOECxdPRfSg4m7XJxMnD66-RaP3NMKjmr1rNtohEn2pzPGuzpmdpcOlm6UytQGqZ5wENXgGUZSh0GDxElXVUltoxNhjjBoA4Y2buUghMZLxlDkSp4x8PNgls5CUNgS1~nyxn~aOJOtWSqaH4ALn9r~ZiRWnLTosL1y5Kh3vo-Av7eBhSlSM~OGdOz03GcTSEw9jckiIJKZoIu7qwqKaP6F7ksGvQQYt~-swsHsaURiAStY5lgHAEQBDbbzcV8Djf-0wCHjBXmkzp5tvg1ASyWqS9~pZvDxI2N9NOhIGXOo-ZZg5AGZqJxDjc14qlNh9RA__",
    },
    {
        name: "Preset 6",
        price: 30,
        cover: "https://s3-alpha-sig.figma.com/img/d8f6/a79d/5214f3b2c45cf2bb23e1b90d5b88e422?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=A5Vis48aliVRdpgxVgAH-YPLWHI~PHHNlI5bfZzRTJxMyJ2SJ2NtHJTlxWkFFxS3K6AyawueoPMeGslvfbnCXXi6x2Sj95J6VWcq7wRrM0E9zgH3YPYjeByw-yC4M3jRJsDW1KP63d2YQxjXWm8Evkb8BI9cw7yZZm69dgVuHbOyYmadNg4ajiYDXqBxzemIV5bnxEseuWwyxVNEDgIaM3HOexr1TG0J2Dp9V4~pXQvhcsODbq2C93AwXR28kw6wbqNtRvC~ce8UY-YRITdx0atvINJTCQ3kZl2C5jOCnxG6O4E8z-Jjo6F0hqfzVGwd0rAfrClNJ0UGCKXCOTbuLQ__",
    },
    {
        name: "Preset 7",
        price: 30,
        cover: "https://s3-alpha-sig.figma.com/img/73b7/cc0f/bae44fd92feef80806d4226a0c187b75?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ce3SsCK8QvKxQEGU1xiRRsWCt8aJ5gdIBIr0Cs99gGdTvSvbc-8vZwXRacqtzr7t-VlrrIcUpkcOMJTumyXo9nJp76vpLZzEGuCvCWe7HR6EClf1Qn4IxijT8lxZt6wCxCvLeuq3d2DPOuAtFRCUT37dK-91fi0SMsYu-mRBouTxQJUB0fl4cYyt00JqXqtA55mx4f48Xvww2A0ZsoUR9Z09GVPZvI7Nw36xEZ34242UnUwtpY~cxdY0jH1in~0z35mKahTNGAurx-pRBUSDRQNn8KPi8sG32NjKdTjuV~1rp9aF8bNrZPVvCFGAP6~vBDEJYuG5GyI7fkvSr6Yszw__",
    },
    {
        name: "Preset 8",
        price: 30,
        cover: "https://s3-alpha-sig.figma.com/img/b97e/7614/71dcb662650ee2f2781e85a9b975de5d?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Rf9IrFN3Du0k7TPOimSdylJkoaLh6hYFBy0KZo9wSvwXgXQHOdoQlIDf415WJe1ZpejD59ur1XmR7jJb3Cd~-obdpsGT7UjsUMdb0JlU0-z88hyELSVfJZ7di6ZY6ZC0E36ibIwikhMrZI-9K4QPzcQlDONMP8JYcijgKperIwvGrdKxLuOlc~hjVWxGVCYWeOJ7ETcPPnpsbtto~Aa7W7L5O22KkS7zojQqIwMSRJ0oobTRufxNZRObRCDPm0NSd9gujbGyb-~w9ATio1PZCgJ0VMycW-6554QuGSjBftxriGfbEoKLVy2ImDh82OZbxWJ~dkT4lIG22r3SmMqxRA__",
    },
]

const Music = () => {
    // STATE FOR SHOW ALL THE TOP TRACKS
    const [showAllTracks, setShowAllTracks] = useState(false);
    // STATE FOR SHOW ALL THE ALBUNS
    const [showAllAlbums, setShowAllAlbums] = useState(false);
    // STATE FOR SHOW ALL THE BEATS
    const [showAllBeats, setShowAllBeats] = useState(false);
    // STATE FOR SHOW ALL THE SOUND KITS
    const [showAllSounds, setShowAllSounds] = useState(false);
    // STATE FOR SHOW ALL THE PRESETS
    const [showAllPresets, setShowAllPresets] = useState(false);

    // STATE TO CONTROL SELECTION MODE
    const [isSelectingTracks, setIsSelectingTracks] = useState(false);
    const [isSelectingAlbums, setIsSelectingAlbums] = useState(false);
    const [isSelectingBeats, setIsSelectingBeats] = useState(false);
    const [isSelectingSounds, setIsSelectingSounds] = useState(false);
    const [isSelectingPresets, setIsSelectingPresets] = useState(false);

    const [selectedItems, setSelectedItems] = useState([]);

    // STATE TO CONTROL DELETE CONFIRMATION MODAL
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [tracks, setTracks] = useState(tracksData);
    const [albums, setAlbums] = useState(albumsData);
    const [beats, setBeats] = useState(beatsData);
    const [sounds, setSounds] = useState(soundsData);
    const [presets, setPresets] = useState(presetsData);
    const [modalContent, setModalContent] = useState({
        type: '', // 'TRACKS', 'ALBUMS', 'BEATS', 'SOUND KITS', 'PRESETS'
        text: '',
        description: '',
    });

    // GET THE TRACKS TO DISPLAY: IF `showAllTracks` IS TRUE SHOW ALL, ELSE SHOWONLY THE FIRST 5 
    const displayedTracks = showAllTracks ? tracks : tracks.slice(0, 5);

    // SELECT / DESELECT ITEM HANDLER (FOR BOTH TRACKS AND ALBUMS)
    const handleSelectItem = (item) => {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter((i) => i !== item));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };

    // DELETE SELECTED ITEMS
    const handleDelete = () => {
        if (modalContent.type === 'albums') {
            const updatedAlbums = albums.filter((album) => !selectedItems.includes(album));
            setAlbums(updatedAlbums);
        } else if (modalContent.type === 'tracks') {
            const updatedTracks = tracks.filter((track) => !selectedItems.includes(track));
            setTracks(updatedTracks);
        } else if (modalContent.type === 'beats') {
            const updatedBeats = beats.filter((beat) => !selectedItems.includes(beat));
            setBeats(updatedBeats);
        } else if (modalContent.type === 'sounds') {
            const updatedSounds = sounds.filter((sound) => !selectedItems.includes(sound));
            setSounds(updatedSounds);
        } else if (modalContent.type === 'presets') {
            const updatedPresets = presets.filter((preset) => !selectedItems.includes(preset));
            setPresets(updatedPresets);
        }
        setSelectedItems([]);
        setIsSelectingTracks(false);
        setIsSelectingAlbums(false);
        setIsSelectingBeats(false);
        setIsSelectingSounds(false);
        setIsSelectingPresets(false);
        setShowDeleteModal(false);
    };

    // TITLE FORMATTER
    const textFormatter = (text, number) => {
        if (text.length > number) {
            return text.slice(0, number) + '...';
        } else {
            return text;
        }
    }

    // MODAL LOGIC FOR DYNAMIC CONTENT
    const renderDeleteModal = () => (
        <Modal
            visible={showDeleteModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowDeleteModal(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Image source={require('../../assets/images/ArtistProfile/delete.png')} style={styles.deleteImage} />
                    <Text style={styles.modalText}>
                        {modalContent.text || 'Delete this selection?'}
                    </Text>
                    <Text style={styles.modalTextDesc}>
                        {modalContent.description || 'Do you really want to delete this selection? This can’t be undone.'}
                    </Text>
                    <View style={styles.modalActions}>
                        <TouchableOpacity onPress={() => setShowDeleteModal(false)} style={styles.cancelButton}>
                            <Text style={styles.buttonText}>No, Keep it.</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleDelete}
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



    return (
        <ScrollView style={styles.container}>
            {/* TOP TRACK SECTION */}
            <View style={styles.section}>
                <View style={styles.header}>
                    <Text style={styles.sectionTitle}>top tracks</Text>
                    {/* Actions for Tracks */}
                    {!isSelectingTracks && (
                        <View style={styles.actionButtons}>
                            {showAllTracks && (
                                <TouchableOpacity onPress={() => setIsSelectingTracks(true)}>
                                    <Text style={styles.selectText}>Select</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                onPress={() => {
                                    setShowAllTracks(!showAllTracks);
                                    setSelectedItems([]);
                                }}>
                                <Text style={styles.showAll}>
                                    {showAllTracks ? 'Exit' : 'Show all'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {isSelectingTracks && (
                        <View style={styles.actionButtons}>
                            <TouchableOpacity onPress={() => setIsSelectingTracks(false)}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setModalContent({
                                        type: 'tracks',
                                        text: 'Delete selected tracks?',
                                        description: 'Do you really want to delete the selected tracks? This can’t be undone.',
                                    });
                                    setShowDeleteModal(true);
                                }}
                                disabled={selectedItems.length === 0}
                            >
                                <Text style={[styles.deleteText, selectedItems.length === 0 && styles.disabledDelete]}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Track List */}
                <View>
                    {displayedTracks.map((track, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.trackItem,
                                selectedItems.includes(track) && styles.selectedItem
                            ]}
                            onPress={() => isSelectingTracks && handleSelectItem(track)}
                        >
                            {selectedItems.includes(track) && (
                                <View style={[styles.checkIconContainer, {
                                    top: 14,
                                    left: 50,
                                }]}>
                                    <Feather name="check" size={18} color="black" style={styles.checkIcon} />
                                </View>
                            )}
                            <View style={styles.trackOrder}>
                                <Text style={styles.trackCount}>{index + 1}</Text>
                                <Image source={{ uri: track.cover }} style={styles.trackImage} />
                            </View>
                            <View style={styles.trackInfo}>
                                <Text style={styles.trackTitle}>{textFormatter(track.name, 26)}</Text>
                                <Text style={styles.artist}>{textFormatter(track.artist, 40)}</Text>
                            </View>
                            <Text style={styles.trackDuration}>{track.duration}</Text>
                            <Image source={require('../../assets/images/ArtistProfile/play.png')} style={styles.play} />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* ALBUMS SECTION */}
            <View style={styles.section}>
                <View style={styles.header}>
                    <Text style={styles.sectionTitle}>albums</Text>
                    {/* Action Buttons */}
                    {!isSelectingAlbums && (
                        <View style={styles.actionButtons}>
                            {showAllAlbums && (
                                <TouchableOpacity onPress={() => setIsSelectingAlbums(true)}>
                                    <Text style={styles.selectText}>Select</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                onPress={() => {
                                    setShowAllAlbums(!showAllAlbums);
                                    setSelectedItems([])
                                }}>
                                <Text style={styles.showAll}>{showAllAlbums ? 'Exit' : 'Show all'}</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {isSelectingAlbums && (
                        <View style={styles.actionButtons}>
                            {/* Cancel Button */}
                            <TouchableOpacity onPress={() => setIsSelectingAlbums(false)}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            {/* Delete Button */}
                            <TouchableOpacity
                                onPress={() => {
                                    setModalContent({
                                        type: 'albums',
                                        text: 'Delete selected albums?',
                                        description: 'Do you really want to delete the selected albums? This can’t be undone.',
                                    });
                                    setShowDeleteModal(true);
                                }}
                                disabled={selectedItems.length === 0}
                            >
                                <Text style={[styles.deleteText, selectedItems.length === 0 && styles.disabledDelete]}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Album List */}
                {showAllAlbums ? (
                    <View style={styles.albumGrid}>
                        {albums.map((album, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.albumGridItem,
                                    selectedItems.includes(album) && styles.selectedItem, // Highlight selected item
                                ]}
                                onPress={() => isSelectingAlbums && handleSelectItem(album)}
                            >
                                {selectedItems.includes(album) && (
                                    <View style={styles.checkIconContainer}>
                                        <Feather name="check" size={18} color="black" style={styles.checkIcon} />
                                    </View>
                                )}
                                <View style={styles.squareImage}>
                                    <Image source={{ uri: album.cover }} style={styles.albumGridImage} />
                                </View>
                                <Text style={styles.albumTitle}>{textFormatter(album.name, 20)}</Text>
                                <Text style={styles.artist}>{album.artist}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {albums.slice(0, 6).map((album, index) => (
                            <View key={index} style={styles.albumItem}>
                                <View style={styles.squareImage}>
                                    <Image source={{ uri: album.cover }} style={styles.albumImage} />
                                </View>
                                <Text style={styles.albumTitle}>{textFormatter(album.name, 18)}</Text>
                                <Text style={styles.artist}>{textFormatter(album.artist, 26)}</Text>
                            </View>
                        ))}
                    </ScrollView>
                )}
            </View>

            {/* BEATS SECTION */}
            <View style={styles.section}>
                <View style={styles.header}>
                    <Text style={styles.sectionTitle}>beats</Text>
                    {!isSelectingBeats && (
                        <View style={styles.actionButtons}>
                            {showAllBeats && (
                                <TouchableOpacity onPress={() => setIsSelectingBeats(true)}>
                                    <Text style={styles.selectText}>Select</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                onPress={() => {
                                    setShowAllBeats(!showAllBeats);
                                    setSelectedItems([]);
                                }}>
                                <Text style={styles.showAll}>
                                    {showAllBeats ? 'Exit' : 'Show all'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {isSelectingBeats && (
                        <View style={styles.actionButtons}>
                            <TouchableOpacity onPress={() => setIsSelectingBeats(false)}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setModalContent({
                                        type: 'beats',
                                        text: 'Delete selected beats?',
                                        description: 'Do you really want to delete the selected beats? This can’t be undone.',
                                    });
                                    setShowDeleteModal(true);
                                }}
                                disabled={selectedItems.length === 0}
                            >
                                <Text style={[styles.deleteText, selectedItems.length === 0 && styles.disabledDelete]}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {showAllBeats ? (
                    <View style={styles.beatGrid}>
                        {beats.map((beat, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.beatGridItem,
                                    selectedItems.includes(beat) && styles.selectedItem,
                                ]}
                                onPress={() => isSelectingBeats && handleSelectItem(beat)}
                            >
                                {selectedItems.includes(beat) && (
                                    <View style={[styles.checkIconContainer, {
                                        top: 5,
                                        left: 120,
                                    }]}>
                                        <Feather name="check" size={18} color="black" style={styles.checkIcon} />
                                    </View>
                                )}
                                <View style={styles.squareImage}>
                                    <Image source={{ uri: beat.cover }} style={styles.coverImage} />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.presetTitle}>{textFormatter(beat.name, 20)}</Text>
                                    <Text style={styles.price}>${beat.price}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {beats.slice(0, 6).map((beat, index) => (
                            <View key={index}>
                                <View style={styles.squareImage}>
                                    <Image source={{ uri: beat.cover }} style={styles.coverImage} />
                                </View>
                                <Text style={styles.presetTitle}>{textFormatter(beat.name, 20)}</Text>
                                <Text style={styles.price}>${beat.price}</Text>
                            </View>
                        ))}
                    </ScrollView>
                )}
            </View>

            {/* SOUND KITS SECTION */}
            <View style={styles.section}>
                <View style={styles.header}>
                    <Text style={styles.sectionTitle}>sound kits</Text>
                    {!isSelectingSounds && (
                        <View style={styles.actionButtons}>
                            {showAllSounds && (
                                <TouchableOpacity onPress={() => setIsSelectingSounds(true)}>
                                    <Text style={styles.selectText}>Select</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                onPress={() => {
                                    setShowAllSounds(!showAllSounds);
                                    setSelectedItems([]);
                                }}>
                                <Text style={styles.showAll}>
                                    {showAllSounds ? 'Exit' : 'Show all'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {isSelectingSounds && (
                        <View style={styles.actionButtons}>
                            <TouchableOpacity onPress={() => setIsSelectingSounds(false)}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setModalContent({
                                        type: 'sounds',
                                        text: 'Delete selected sounds?',
                                        description: 'Do you really want to delete the selected sounds? This can’t be undone.',
                                    });
                                    setShowDeleteModal(true);
                                }}
                                disabled={selectedItems.length === 0}
                            >
                                <Text style={[styles.deleteText, selectedItems.length === 0 && styles.disabledDelete]}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {showAllSounds ? (
                    <View style={styles.soundKitGrid}>
                        {sounds.map((sound, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.soundKitGridItem,
                                    selectedItems.includes(sound) && styles.selectedItem,
                                ]}
                                onPress={() => isSelectingSounds && handleSelectItem(sound)}
                            >
                                {selectedItems.includes(sound) && (
                                    <View style={[styles.checkIconContainer, {
                                        top: 5,
                                        left: 120,
                                    }]}>
                                        <Feather name="check" size={18} color="black" style={styles.checkIcon} />
                                    </View>
                                )}
                                <View style={styles.squareImage}>
                                    <Image source={{ uri: sound.cover }} style={styles.coverImage} />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.presetTitle}>{textFormatter(sound.name, 20)}</Text>
                                    <Text style={styles.price}>${sound.price}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {sounds.slice(0, 6).map((sound, index) => (
                            <View key={index}>
                                <View style={styles.squareImage}>
                                    <Image source={{ uri: sound.cover }} style={styles.coverImage} />
                                </View>
                                <Text style={styles.presetTitle}>{textFormatter(sound.name, 20)}</Text>
                                <Text style={styles.price}>${sound.price}</Text>
                            </View>
                        ))}
                    </ScrollView>
                )}
            </View>

            {/* PRESETS SECTION */}
            <View style={styles.section}>
                <View style={styles.header}>
                    <Text style={styles.sectionTitle}>presets</Text>
                    {!isSelectingPresets && (
                        <View style={styles.actionButtons}>
                            {showAllPresets && (
                                <TouchableOpacity onPress={() => setIsSelectingPresets(true)}>
                                    <Text style={styles.selectText}>Select</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                onPress={() => {
                                    setShowAllPresets(!showAllPresets);
                                    setSelectedItems([]);
                                }}>
                                <Text style={styles.showAll}>
                                    {showAllPresets ? 'Exit' : 'Show all'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {isSelectingPresets && (
                        <View style={styles.actionButtons}>
                            <TouchableOpacity onPress={() => setIsSelectingPresets(false)}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setModalContent({
                                        type: 'presets',
                                        text: 'Delete selected presets?',
                                        description: 'Do you really want to delete the selected presets? This can’t be undone.',
                                    });
                                    setShowDeleteModal(true);
                                }}
                                disabled={selectedItems.length === 0}
                            >
                                <Text style={[styles.deleteText, selectedItems.length === 0 && styles.disabledDelete]}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {showAllPresets ? (
                    <View style={styles.presetGrid}>
                        {presets.map((preset, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.presetGridItem,
                                    selectedItems.includes(preset) && styles.selectedItem,
                                ]}
                                onPress={() => isSelectingPresets && handleSelectItem(preset)}
                            >
                                {selectedItems.includes(preset) && (
                                    <View style={[styles.checkIconContainer, {
                                        top: 5,
                                        left: 120,
                                    }]}>
                                        <Feather name="check" size={18} color="black" style={styles.checkIcon} />
                                    </View>
                                )}
                                <View style={styles.squareImage}>
                                    <Image source={{ uri: preset.cover }} style={styles.coverImage} />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.presetTitle}>{textFormatter(preset.name, 20)}</Text>
                                    <Text style={styles.price}>${preset.price}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {presets.slice(0, 6).map((preset, index) => (
                            <View key={index}>
                                <View style={styles.squareImage}>
                                    <Image source={{ uri: preset.cover }} style={styles.coverImage} />
                                </View>
                                <Text style={styles.presetTitle}>{textFormatter(preset.name, 20)}</Text>
                                <Text style={styles.price}>${preset.price}</Text>
                            </View>
                        ))}
                    </ScrollView>
                )}
            </View>

            {/* Render the Modal */}
            {renderDeleteModal()}
        </ScrollView >
    );
};

export default Music;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
    },
    section: {
        marginVertical: 5,
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
        // marginTop: 2,
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
        fontWeight: '400',
        lineHeight: 18,
    },
    deleteText: {
        color: 'red',
        fontSize: 12,
    },
    cancelText: {
        color: Colors.white,
        fontSize: 12,
    },
    selectText: {
        color: Colors.white,
        fontSize: 12,
        textAlign: 'center',
    },
    selectedItem: {
        position: 'relative'
    },
    checkIconContainer: {
        position: 'absolute',
        top: -4,
        left: 80,
        backgroundColor: '#28A745',
        borderRadius: 24,
        padding: 6,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
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
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 18,
    },
    artist: {
        color: Colors.white,
        fontFamily: "Open Sans",
        fontSize: 10,
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
    play: {
        position: 'absolute',
        top: 15,
        left: 56
    },
    albumGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    albumGridItem: {
        width: '30%',
        marginVertical: 10,
        alignItems: 'center',
    },
    albumItem: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 8,
    },
    albumImage: {
        marginHorizontal: -1,
        width: 150,
        height: 150,
        borderRadius: 80,
    },
    albumGridImage: {
        marginHorizontal: -1,
        width: 100,
        height: 100,
        borderRadius: 80,
    },
    albumTitle: {
        color: Colors.white,
        fontFamily: 'Open Sans',
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 18,
    },
    beatGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    textContainer: {
        width: '100%',
        marginRight: 24,
        alignItems: 'flex-start',
    },
    beatGridItem: {
        width: '45%',
        alignItems: 'center',
    },
    presetGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    presetGridItem: {
        width: '45%',
        alignItems: 'center',
    },
    coverItem: {
        margin: 26,
        marginLeft: 16,
        margin: 'auto',
        width: 116,
    },
    soundKitGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        // paddingHorizontal: 10,
    },
    soundKitGridItem: {
        width: '45%',
        alignItems: 'center',
    },
    coverImage: {
        height: 146,
        width: 146,
        borderRadius: 14,
        marginRight: 20,
    },
    presetTitle: {
        color: Colors.white,
        fontFamily: "Open Sans",
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 20,
        marginLeft: 22,
    },
    price: {
        color: Colors.white,
        fontFamily: "Open Sans",
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 20,
        marginLeft: 22,
        marginBottom: 10,
        opacity: 0.7,
    },
    soundKitItem: {
        alignItems: 'center',
        marginRight: 20,
    },
    presetItem: {
        alignItems: 'center',
        marginRight: 20,
    },
    squareImage: {
        borderRadius: 10,
        marginBottom: 5,
        marginLeft: 20,
        textAlign: 'center',
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
