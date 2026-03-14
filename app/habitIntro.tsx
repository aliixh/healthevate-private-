import { ButtonStyles, Colors, FontFamily, FontSize } from '@/constants/theme';
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const LINES = [
    "Now it’s time to set your habits.",
    "Don’t know what to focus on? Don’t worry, we have a list of preset habits to inspire you.",
];

// pause between lines (ms)
const LINE_PAUSE = 500;
// speed per character (ms)
const CHAR_SPEED = 65;

export default function GameIntroOnboarding() {
    const router = useRouter();
    const [typed, setTyped] = React.useState(['', '']);
    const [currentLine, setCurrentLine] = React.useState(0);

    React.useEffect(() => {
        if (currentLine >= LINES.length) return;

        let charIndex = 0;
        const line = LINES[currentLine];

        const interval = setInterval(() => {
            charIndex++;
            setTyped(prev => {
                const next = [...prev];
                next[currentLine] = line.slice(0, charIndex);
                return next;
            });
            if (charIndex >= line.length) {
                clearInterval(interval);
                setTimeout(() => setCurrentLine(l => l + 1), LINE_PAUSE);
            }
        }, CHAR_SPEED);

        return () => clearInterval(interval);
    }, [currentLine]);

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
                <Text style={styles.text}>{typed[0]}</Text>
                {currentLine >= 1 && (
                    <>
                        <View style={{ height: 16 }} />
                        <Text style={styles.text}>{typed[1]}</Text>
                    </>
                )}
            </View>

            {/* Right dashed line */}
            <View style={styles.dashedLineContainer}>
                {Array.from({ length: 15 }).map((_, i) => (
                    <View key={i} style={styles.dash} />
                ))}
            </View>
            {/* Right border line */}
            <View style={styles.borderLine} />

            {/* Next Button */}
            <View style={styles.nextButtonWrapper}>
                <TouchableOpacity activeOpacity={0.85} onPress={() => router.push('/(tabs)/new_habit')}>
                    <View style={ButtonStyles.wrapper}>
                        <View style={ButtonStyles.nextShadow} />
                        <View style={ButtonStyles.next}>
                            <Text style={ButtonStyles.nextText}>next</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
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
        gap: 8,
    },
    text: {
        color: Colors.textGreen,
        fontFamily: FontFamily.pixel,
        fontSize: FontSize.xl,
        textAlign: 'center',
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
    nextButtonWrapper: {
        position: 'absolute',
        bottom: 32,
        right: 60,
    },
});
