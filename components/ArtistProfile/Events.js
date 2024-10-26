import { Image, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import React from 'react';
import { Colors } from '../../constants/Color';

// DUMMY EVENTS DATA
const events = [
    {
        id: 1,
        date: 'Oct 18',
        city: 'Fort Lauderdale',
        venue: 'Revolution Live',
        time: 'Fri, 7 PM',
        attendees: 447,
        attendeesCover: [
            'https://s3-alpha-sig.figma.com/img/9253/cfb9/9b8a861f94614d0a8958ffb8d1ad5f1d?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Hn-tAYFGasCFji6~Qm1uNx8-RKfLYvGsLqMIlFX00PwmQ-bsuwHh3llCP8CXNRpDV0OB4wz6u7oyQbxNrmRxBJSiw31WdjftwG0aBD-OFhXVynmAz1M2AIMm4Qc~jkDFBp~nf6jpemqC2TmjLjDRkVwDQk37CVGVUnFVgG4PSukeRnUQxzllix-0W4t1TQF8P1GAVAOZbaatKRMzmDkVURCeRON3nDYaOnnV6FL1t6liRv7m5hla~vlRkCLrXt3BUv3XhbCK8u40XcHBbP7qDCXxYdHCsZEEiKS3UnkbOUIc6sAWZimNVPnG1GmJawyt4u6cE3F~wSccv9PJ54KFBg__',
            'https://s3-alpha-sig.figma.com/img/c55d/ef94/e44e69d5bb8503477a7eca59e753bffa?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Zrf2MphOlt-gSL8BMLE1RhYhV3CEnMBPtNLXW7n0Ov4tLpLA3KLvAqwxuHPWn6xI-1H6P-RLOZ3yPtP5QqNA6lA~3R13s7lfZCWH4vSVvD5q3VSjqBEkQOBzqzThHZgrX4LtpNO2HF82FKTstUfTSmnBVlQ09nhKWHRjQieU5Kf7NNkOddpYkfWJ80RsQBlXtUuegv7qhNBjnpJwzH~4Och94q62C8GgrPYdVIrRKhAHQXdCfh-hV03ft1wQmQ0R5urn0Yhlkx3JU2edFjsqvG3g-27CKYpsxm0l0XoAK~dUh3rgNnpHwrwnvedsv3uErNWr5TtaE3Cwof9UDSpqGg__',
            'https://s3-alpha-sig.figma.com/img/8b25/f292/89e88889188d07ef9624cbc063aa7fc2?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=jxT-YJprPvTPcbu8rrqhbhxyRrVC38wZjIo~UhSecS3V1Y9pK913aklbJOqr3Q9jXGOVU3EV3i6UivhVgeoWpDeYpLvpEIXAgzACTNP7evXY7pIsAfCCrrOnVLbIhsk7koglXO~4fMprBQrKOEZZi8AzgymCVBP~1lmUW768Z679PgM8mmUj2EaeM7gGx9iXebALbrLER6~EE8KDRGNMzDpJKg~WoCjMoUqJ4zALVkDpJRz6Y537XZm2HueAeqJKlrEIWH4X5qWuma1Oac98B25iIT3GbUje~bKYC626mHnq61ETy2kv-~er33nGECDILlCaHDxSaIyvMZZCU9jMuA__',
        ],
    },
    {
        id: 2,
        date: 'Oct 19',
        city: 'Orlando',
        venue: 'The Social',
        time: 'Sat, 7 PM',
        attendees: 447,
        attendeesCover: [
            'https://s3-alpha-sig.figma.com/img/9253/cfb9/9b8a861f94614d0a8958ffb8d1ad5f1d?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Hn-tAYFGasCFji6~Qm1uNx8-RKfLYvGsLqMIlFX00PwmQ-bsuwHh3llCP8CXNRpDV0OB4wz6u7oyQbxNrmRxBJSiw31WdjftwG0aBD-OFhXVynmAz1M2AIMm4Qc~jkDFBp~nf6jpemqC2TmjLjDRkVwDQk37CVGVUnFVgG4PSukeRnUQxzllix-0W4t1TQF8P1GAVAOZbaatKRMzmDkVURCeRON3nDYaOnnV6FL1t6liRv7m5hla~vlRkCLrXt3BUv3XhbCK8u40XcHBbP7qDCXxYdHCsZEEiKS3UnkbOUIc6sAWZimNVPnG1GmJawyt4u6cE3F~wSccv9PJ54KFBg__',
            'https://s3-alpha-sig.figma.com/img/c55d/ef94/e44e69d5bb8503477a7eca59e753bffa?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Zrf2MphOlt-gSL8BMLE1RhYhV3CEnMBPtNLXW7n0Ov4tLpLA3KLvAqwxuHPWn6xI-1H6P-RLOZ3yPtP5QqNA6lA~3R13s7lfZCWH4vSVvD5q3VSjqBEkQOBzqzThHZgrX4LtpNO2HF82FKTstUfTSmnBVlQ09nhKWHRjQieU5Kf7NNkOddpYkfWJ80RsQBlXtUuegv7qhNBjnpJwzH~4Och94q62C8GgrPYdVIrRKhAHQXdCfh-hV03ft1wQmQ0R5urn0Yhlkx3JU2edFjsqvG3g-27CKYpsxm0l0XoAK~dUh3rgNnpHwrwnvedsv3uErNWr5TtaE3Cwof9UDSpqGg__',
            'https://s3-alpha-sig.figma.com/img/8b25/f292/89e88889188d07ef9624cbc063aa7fc2?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=jxT-YJprPvTPcbu8rrqhbhxyRrVC38wZjIo~UhSecS3V1Y9pK913aklbJOqr3Q9jXGOVU3EV3i6UivhVgeoWpDeYpLvpEIXAgzACTNP7evXY7pIsAfCCrrOnVLbIhsk7koglXO~4fMprBQrKOEZZi8AzgymCVBP~1lmUW768Z679PgM8mmUj2EaeM7gGx9iXebALbrLER6~EE8KDRGNMzDpJKg~WoCjMoUqJ4zALVkDpJRz6Y537XZm2HueAeqJKlrEIWH4X5qWuma1Oac98B25iIT3GbUje~bKYC626mHnq61ETy2kv-~er33nGECDILlCaHDxSaIyvMZZCU9jMuA__',
        ],
    },
    {
        id: 3,
        date: 'Oct 20',
        city: 'Atlanta',
        venue: 'The Masquerade',
        time: 'Sun, 7 PM',
        attendees: 447,
        attendeesCover: [
            'https://s3-alpha-sig.figma.com/img/9253/cfb9/9b8a861f94614d0a8958ffb8d1ad5f1d?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Hn-tAYFGasCFji6~Qm1uNx8-RKfLYvGsLqMIlFX00PwmQ-bsuwHh3llCP8CXNRpDV0OB4wz6u7oyQbxNrmRxBJSiw31WdjftwG0aBD-OFhXVynmAz1M2AIMm4Qc~jkDFBp~nf6jpemqC2TmjLjDRkVwDQk37CVGVUnFVgG4PSukeRnUQxzllix-0W4t1TQF8P1GAVAOZbaatKRMzmDkVURCeRON3nDYaOnnV6FL1t6liRv7m5hla~vlRkCLrXt3BUv3XhbCK8u40XcHBbP7qDCXxYdHCsZEEiKS3UnkbOUIc6sAWZimNVPnG1GmJawyt4u6cE3F~wSccv9PJ54KFBg__',
            'https://s3-alpha-sig.figma.com/img/c55d/ef94/e44e69d5bb8503477a7eca59e753bffa?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Zrf2MphOlt-gSL8BMLE1RhYhV3CEnMBPtNLXW7n0Ov4tLpLA3KLvAqwxuHPWn6xI-1H6P-RLOZ3yPtP5QqNA6lA~3R13s7lfZCWH4vSVvD5q3VSjqBEkQOBzqzThHZgrX4LtpNO2HF82FKTstUfTSmnBVlQ09nhKWHRjQieU5Kf7NNkOddpYkfWJ80RsQBlXtUuegv7qhNBjnpJwzH~4Och94q62C8GgrPYdVIrRKhAHQXdCfh-hV03ft1wQmQ0R5urn0Yhlkx3JU2edFjsqvG3g-27CKYpsxm0l0XoAK~dUh3rgNnpHwrwnvedsv3uErNWr5TtaE3Cwof9UDSpqGg__',
            'https://s3-alpha-sig.figma.com/img/8b25/f292/89e88889188d07ef9624cbc063aa7fc2?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=jxT-YJprPvTPcbu8rrqhbhxyRrVC38wZjIo~UhSecS3V1Y9pK913aklbJOqr3Q9jXGOVU3EV3i6UivhVgeoWpDeYpLvpEIXAgzACTNP7evXY7pIsAfCCrrOnVLbIhsk7koglXO~4fMprBQrKOEZZi8AzgymCVBP~1lmUW768Z679PgM8mmUj2EaeM7gGx9iXebALbrLER6~EE8KDRGNMzDpJKg~WoCjMoUqJ4zALVkDpJRz6Y537XZm2HueAeqJKlrEIWH4X5qWuma1Oac98B25iIT3GbUje~bKYC626mHnq61ETy2kv-~er33nGECDILlCaHDxSaIyvMZZCU9jMuA__',
        ],
    },
    {
        id: 4,
        date: 'Oct 21',
        city: 'Raleigh',
        venue: 'Red Hat Amphitheatre',
        time: 'Mon, 7 PM',
        attendees: 447,
        attendeesCover: [
            'https://s3-alpha-sig.figma.com/img/9253/cfb9/9b8a861f94614d0a8958ffb8d1ad5f1d?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Hn-tAYFGasCFji6~Qm1uNx8-RKfLYvGsLqMIlFX00PwmQ-bsuwHh3llCP8CXNRpDV0OB4wz6u7oyQbxNrmRxBJSiw31WdjftwG0aBD-OFhXVynmAz1M2AIMm4Qc~jkDFBp~nf6jpemqC2TmjLjDRkVwDQk37CVGVUnFVgG4PSukeRnUQxzllix-0W4t1TQF8P1GAVAOZbaatKRMzmDkVURCeRON3nDYaOnnV6FL1t6liRv7m5hla~vlRkCLrXt3BUv3XhbCK8u40XcHBbP7qDCXxYdHCsZEEiKS3UnkbOUIc6sAWZimNVPnG1GmJawyt4u6cE3F~wSccv9PJ54KFBg__',
            'https://s3-alpha-sig.figma.com/img/c55d/ef94/e44e69d5bb8503477a7eca59e753bffa?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Zrf2MphOlt-gSL8BMLE1RhYhV3CEnMBPtNLXW7n0Ov4tLpLA3KLvAqwxuHPWn6xI-1H6P-RLOZ3yPtP5QqNA6lA~3R13s7lfZCWH4vSVvD5q3VSjqBEkQOBzqzThHZgrX4LtpNO2HF82FKTstUfTSmnBVlQ09nhKWHRjQieU5Kf7NNkOddpYkfWJ80RsQBlXtUuegv7qhNBjnpJwzH~4Och94q62C8GgrPYdVIrRKhAHQXdCfh-hV03ft1wQmQ0R5urn0Yhlkx3JU2edFjsqvG3g-27CKYpsxm0l0XoAK~dUh3rgNnpHwrwnvedsv3uErNWr5TtaE3Cwof9UDSpqGg__',
            'https://s3-alpha-sig.figma.com/img/8b25/f292/89e88889188d07ef9624cbc063aa7fc2?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=jxT-YJprPvTPcbu8rrqhbhxyRrVC38wZjIo~UhSecS3V1Y9pK913aklbJOqr3Q9jXGOVU3EV3i6UivhVgeoWpDeYpLvpEIXAgzACTNP7evXY7pIsAfCCrrOnVLbIhsk7koglXO~4fMprBQrKOEZZi8AzgymCVBP~1lmUW768Z679PgM8mmUj2EaeM7gGx9iXebALbrLER6~EE8KDRGNMzDpJKg~WoCjMoUqJ4zALVkDpJRz6Y537XZm2HueAeqJKlrEIWH4X5qWuma1Oac98B25iIT3GbUje~bKYC626mHnq61ETy2kv-~er33nGECDILlCaHDxSaIyvMZZCU9jMuA__',
        ],
    },
];

const EventCard = ({ event }) => (
    <TouchableOpacity style={styles.eventCard} onPress={{ /* TODO GO TO EVENT SCREEN */ }}>
        <View style={styles.dateContainer}>
            <Text style={styles.month}>{event.date.split(' ')[0]}</Text>
            <Text style={styles.when}>{event.date.split(' ')[1]}</Text>
        </View>
        <View style={styles.eventInfo}>
            <Text style={styles.city}>{event.city}</Text>
            <Text style={styles.venue}>
                {event.time} • {event.venue}
            </Text>
            <View style={styles.attendeesContainer}>
                {/* STACKED ATTENDEES PROFILE IMAGES */}
                <View style={styles.attendeeImages}>
                    {event.attendeesCover.map((cover, index) => (
                        <Image
                            key={index}
                            source={{ uri: cover }}
                            style={[styles.attendeeImage, { left: index * 25, zIndex: index }]}
                        />
                    ))}
                </View>

                {/* ATTENDEES COUNT */}
                <View style={styles.attendeeCountContainer}>
                    <Image
                        source={require('../../assets/images/ArtistProfile/user.png')}
                        style={styles.userIcon}
                    />
                    <Text style={styles.attendeeCount}>{event.attendees}</Text>
                </View>

                {/* TICKETS BUTTON */}
                <TouchableOpacity style={styles.ticketButton}>
                    <Text style={styles.ticketButtonText}>Tickets</Text>
                </TouchableOpacity>
            </View>
        </View>
    </TouchableOpacity >
);

const Events = () => {
    return (
        <>
            <TouchableOpacity style={styles.manageEvents}>
                <Text style={styles.manageEventsText}>Manage Events</Text>
            </TouchableOpacity>
            <FlatList
                data={events}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <EventCard event={item} />}
                scrollEnabled={false}
                contentContainerStyle={styles.container}
            />
        </>
    );
};

export default Events;

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    manageEvents: {
        display: 'flex',
        width: 343,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        margin: 'auto',
        marginTop: 14,
        backgroundColor: '#232323',
        gap: 10,
    },
    manageEventsText: {
        color: Colors.white,
        textAlign: 'center',
        fontFamily: "Open Sans",
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 20,
    },
    eventCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
        borderRadius: 10,
        marginBottom: 16,
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
        textAlign: 'center',
        fontFamily: "Open Sans",
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: 20,
    },
    when: {
        color: Colors.white,
        textAlign: 'center',
        fontFamily: "Open Sans",
        fontSize: 28,
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: 34,
    },
    eventInfo: {
        flex: 1,
        paddingHorizontal: 16,
    },
    city: {
        overflow: 'hidden',
        color: Colors.white,
        fontFamily: 'Open Sans',
        fontSize: 22,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 28,
    },
    venue: {
        overflow: 'hidden',
        color: '#ACACAC',
        fontFamily: 'Open Sans',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: 20,
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
        width: 35,
        height: 35,
        borderRadius: 35,
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
    ticketButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 14,
    },
    ticketButtonText: {
        color: Colors.white,
        fontFamily: 'Open Sans',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: 20,
    },
});

