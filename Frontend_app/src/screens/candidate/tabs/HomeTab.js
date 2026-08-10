import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-paper';
import Ionicons from '@react-native-vector-icons/ionicons';
import pickResume from '../../../services/documentPickerService';
import { uploadResume } from '../../../api/candidate/resumeApi';
import { getApiErrorMessage } from '../../../api/apiClient';

function HomeTab({ navigation }) {

    const [resume, setResume] = useState(null)
    const [jobDescription, setJobDescription] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSelectResume = async () => {
        const file = await pickResume();
        if (file) {
            setResume(file);
        }
    };

    const handleAnalyzeResume = async () => {
        if (!resume) {
            Alert.alert("Validation", "Please select a resume.");
            return;
        }

        try {
            setLoading(true);

            const uploadResponse = await uploadResume(resume, jobDescription);
            const resumeId = uploadResponse.data.resume_id;

            navigation.navigate("ATSScore", {
                analysis: {
                    resumeId,
                    resumeName: resume.name,
                    jobDescription,
                    analysisDate: new Date().toISOString(),
                    ...uploadResponse.data,
                },
            })

        } catch (error) {
            Alert.alert(
                "Error",
                getApiErrorMessage(error, "Unable to analyze resume.")
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={0}
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                >
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <View style={styles.logoCircle}>
                                <Text style={styles.resumeIcon}>📄</Text>

                                <View style={styles.sparkleContainer}>
                                    <Text style={styles.sparkleIcon}>✨</Text>
                                </View>
                            </View>
                        </View>

                        <Text style={styles.title}>AI Resume Analyzer</Text>

                        <Text style={styles.subtitle}>
                            Upload your resume and{"\n"}
                            get instant ATS analysis
                        </Text>
                    </View>

                    {/* Floating White Card */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Upload Resume</Text>

                        <Text style={styles.cardSubtitle}>
                            Upload your resume to start{"\n"}
                            the ATS analysis.
                        </Text>

                        <View style={styles.uploadBox}>
                            <Text style={styles.uploadTitle}>Upload Resume</Text>

                            <Text style={styles.uploadText}>
                                {resume ? resume.name : "Browes File"}
                            </Text>

                            <Text style={styles.fileTypes}>PDF • DOC • DOCX</Text>

                            <TouchableOpacity
                                style={styles.browseButton}
                                activeOpacity={0.85}
                                onPress={handleSelectResume}
                            >
                                <Text style={styles.browseButtonText}>SELECT RESUME FILE</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.jdSection}>
                            <Text style={styles.jdLabel}>
                                Job Description <Text style={styles.optionalText}>(Optional)</Text>
                            </Text>

                            <TextInput
                                mode="outlined"
                                placeholder="Paste the job description here..."
                                multiline
                                numberOfLines={5}
                                style={styles.jdInput}
                                outlineColor="#DDE1EC"
                                activeOutlineColor="#5B5FEF"
                                placeholderTextColor="#8A90A6"
                                value={jobDescription}
                                onChangeText={setJobDescription}
                            />
                        </View>

                        <View style={styles.selectedResumeSection}>
                            <Text style={styles.sectionLabel}>Selected Resume</Text>

                            <View style={styles.selectedResumeBox}>

                                <Ionicons
                                    name="document-text-outline"
                                    size={20}
                                    color="#5B5FEF"
                                />

                                <Text
                                    style={styles.selectedResumeText}
                                    numberOfLines={1}
                                >
                                    {resume ? resume.name : "No file selected"}
                                </Text>

                                {resume && (
                                    <TouchableOpacity
                                        onPress={() => setResume(null)}
                                        activeOpacity={0.8}
                                    >
                                        <Ionicons
                                            name="close-circle"
                                            size={24}
                                            color="#FF4D4F"
                                        />
                                    </TouchableOpacity>
                                )}

                            </View>
                        </View>

                        <View style={styles.infoCard}>
                            <Text style={styles.infoCardTitle}>ATS Analysis Includes</Text>

                            <View style={styles.infoItem}>
                                <Ionicons name="checkmark-circle-outline" size={18} color="#5B5FEF" />
                                <Text style={styles.infoItemText}>Resume Score</Text>
                            </View>

                            <View style={styles.infoItem}>
                                <Ionicons name="checkmark-circle-outline" size={18} color="#5B5FEF" />
                                <Text style={styles.infoItemText}>Missing Skills</Text>
                            </View>

                            <View style={styles.infoItem}>
                                <Ionicons name="checkmark-circle-outline" size={18} color="#5B5FEF" />
                                <Text style={styles.infoItemText}>Suggestions</Text>
                            </View>

                            <View style={styles.infoItem}>
                                <Ionicons name="checkmark-circle-outline" size={18} color="#5B5FEF" />
                                <Text style={styles.infoItemText}>Keyword Match</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.analyzeButton}
                            activeOpacity={0.85}
                            onPress={handleAnalyzeResume}
                            disabled={loading}
                        >
                            <Text style={styles.analyzeButtonText}>
                                {loading ? 'ANALYZING...' : 'ANALYZE RESUME'}
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.bottomTipTitle}>Supported formats</Text>

                        <Text style={styles.bottomTipText}>
                            PDF • DOC • DOCX{"\n"}
                            Maximum Size : 5 MB
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FF',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 40,
    },

    header: {
        backgroundColor: '#5B5FEF',
        height: 260,
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },

    logoContainer: {
        marginBottom: 20,
    },

    logoCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: 'rgba(255,255,255,0.18)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    resumeIcon: {
        fontSize: 42,
    },

    sparkleContainer: {
        position: 'absolute',
        top: 12,
        right: 12,
    },

    sparkleIcon: {
        fontSize: 18,
    },

    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 10,
    },

    subtitle: {
        fontSize: 16,
        color: '#E8E8FF',
        textAlign: 'center',
        lineHeight: 24,
    },

    card: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginTop: -35,
        borderRadius: 24,
        padding: 22,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },

        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 8,
    },

    cardTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#172033',
        textAlign: 'center',
    },

    cardSubtitle: {
        fontSize: 14,
        color: '#7A8194',
        textAlign: 'center',
        lineHeight: 21,
        marginTop: 8,
        marginBottom: 20,
    },

    uploadBox: {
        backgroundColor: '#F8F7FF',
        borderWidth: 1.5,
        borderColor: '#CFCBFF',
        borderStyle: 'dashed',
        borderRadius: 22,
        paddingVertical: 26,
        paddingHorizontal: 18,
        alignItems: 'center',
    },

    uploadTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#172033',
        textAlign: 'center',
    },

    uploadText: {
        fontSize: 14,
        color: '#5F6678',
        textAlign: 'center',
        lineHeight: 21,
        marginTop: 10,
    },

    fileTypes: {
        fontSize: 12,
        fontWeight: '700',
        color: '#7A8194',
        marginTop: 10,
        marginBottom: 18,
        letterSpacing: 0.4,
    },

    browseButton: {
        width: '100%',
        height: 52,
        borderRadius: 14,
        backgroundColor: '#5B5FEF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#5B5FEF',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.22,
        shadowRadius: 8,
        elevation: 5,
    },

    browseButtonText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.6,
    },

    jdSection: {
        marginTop: 18,
    },

    jdLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#3E4658',
        marginBottom: 10,
    },

    optionalText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#7A8194',
    },

    jdInput: {
        backgroundColor: '#F8F9FD',
        borderRadius: 18,
        minHeight: 120,
        paddingHorizontal: 14,
        paddingTop: 14,
        paddingBottom: 14,
    },

    selectedResumeSection: {
        marginTop: 18,
    },

    sectionLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#3E4658',
        marginBottom: 10,
    },

    selectedResumeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FD',
        borderWidth: 1,
        borderColor: '#E1E4EC',
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },

    selectedResumeText: {
        flex: 1,
        fontSize: 14,
        color: '#3E4658',
        marginLeft: 10,
        marginRight: 10,
    },

    infoCard: {
        marginTop: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#E1E4EC',
        padding: 16,
    },

    infoCardTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#172033',
        marginBottom: 12,
    },

    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },

    infoItemText: {
        fontSize: 13,
        color: '#3E4658',
        marginLeft: 8,
    },

    analyzeButton: {
        marginTop: 18,
        height: 54,
        borderRadius: 14,
        backgroundColor: '#5B5FEF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#5B5FEF',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },

    analyzeButtonText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.7,
    },

    bottomTipTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#3E4658',
        textAlign: 'center',
        marginTop: 16,
    },

    bottomTipText: {
        fontSize: 12,
        color: '#7A8194',
        textAlign: 'center',
        lineHeight: 18,
        marginTop: 6,
    },
});

export default HomeTab
