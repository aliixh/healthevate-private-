import { Colors, FontFamily, FontSize, ButtonStyles } from '@/constants/theme';
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NameOnboarding() {
    const router = useRouter();
    const [name, setName] = React.useState('');

    const handleNext = async () => {
        if (!name.trim()) return;
        await AsyncStorage.setItem('userName', name.trim());
        router.push('/character');
    };

    return (
        <View style={styles.container}>
            {/* Left border line */}
            <View style={styles.borderLine} />
            {/* Left dashed line */}
            <View style={styles.dashedLineContainer}>
                {Array.from({ length: 15 }).map((_, i) => (
                    <View key={i} style={styles.dash} />
                ))}
            </View>

            {/* Main content */}
            <View style={styles.content}>
                <Text style={styles.text}>What should we call you?</Text>

                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Type your name here..."
                        placeholderTextColor="#BD8163"
                        maxLength={20}
                    />
                    <View style={{ width: 110 }}>
                        <TouchableOpacity
                            activeOpacity={name.trim() ? 0.85 : 1}
                            onPress={handleNext}
                        >
                            <View style={ButtonStyles.wrapper}>
                                <View style={name.trim() ? ButtonStyles.nextShadow : ButtonStyles.nextDisabledShadow} />
                                <View style={name.trim() ? ButtonStyles.next : ButtonStyles.nextDisabled}>
                                    <Text style={name.trim() ? ButtonStyles.nextText : ButtonStyles.nextDisabledText}>next</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Right dashed line */}
            <View style={styles.dashedLineContainer}>
                {Array.from({ length: 15 }).map((_, i) => (
                    <View key={i} style={styles.dash} />
                ))}
            </View>
            {/* Right border line */}
            <View style={styles.borderLine} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Colors.background,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 40,
        paddingHorizontal: 40,
    },
    text: {
        color: Colors.textGreen,
        fontFamily: FontFamily.pixel,
        fontSize: FontSize.xxl,
        textAlign: 'center',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        width: '100%',
    },
    input: {
        flex: 1,
        backgroundColor: Colors.textbox,
        borderRadius: 999,
        borderWidth: 4,
        borderColor: Colors.greenOutline,
        paddingHorizontal: 24,
        paddingVertical: 14,
        fontFamily: FontFamily.pixel,
        fontSize: FontSize.xl,
        color: Colors.textDark,
    },
    borderLine: {
        width: 3,
        backgroundColor: Colors.orange,
        alignSelf: 'stretch',
        marginLeft: 8,
        marginRight: 8,
    },
    dashedLineContainer: {
        width: 2,
        alignSelf: 'stretch',
        marginLeft: 8,
        marginRight: 8,
        justifyContent: 'space-evenly',
    },
    dash: {
        width: 2,
        height: 15,
        backgroundColor: Colors.orange,
    },
});
