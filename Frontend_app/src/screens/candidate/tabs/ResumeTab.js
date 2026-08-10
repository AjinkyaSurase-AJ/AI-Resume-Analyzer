import Ionicons from "@react-native-vector-icons/ionicons";
import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { deleteResume, getResumes } from '../../../api/candidate/resumeApi';
import { getAnalysisResult } from '../../../api/candidate/analysisApi';
import { getApiErrorMessage } from '../../../api/apiClient';

function ResumeTab({navigation}) {
    const [resumes, setResumes] = useState([]);

    const loadResumes = async () => {
        try {
            const response = await getResumes();
            const records = response.data.records.map((item) => ({
                resumeId: item.resume_id,
                resumeName: item.original_name,
                atsScore: Number(item.ats_score || 0),
                uploadedAt: new Date(item.upload_date).toLocaleDateString(),
            }));
            setResumes(records);
        } catch (error) {
            Alert.alert('Error', getApiErrorMessage(error, 'Unable to load resumes.'));
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', loadResumes);
        return unsubscribe;
    }, [navigation]);

    const handleOpenResume = async (resume) => {
        try {
            const response = await getAnalysisResult(resume.resumeId);
            navigation.navigate('ATSScore', {
                analysis: {
                    ...response.data,
                    resumeId: resume.resumeId,
                    resumeName: resume.resumeName,
                    analysisDate: response.data.upload_date,
                },
            });
        } catch (error) {
            Alert.alert('Error', getApiErrorMessage(error, 'Unable to load resume analysis.'));
        }
    };

    const handleDeleteResume = (resumeId) => {
        Alert.alert('Delete Resume', 'Are you sure you want to delete this resume?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await deleteResume(resumeId);
                        await loadResumes();
                    } catch (error) {
                        Alert.alert('Error', getApiErrorMessage(error, 'Unable to delete resume.'));
                    }
                },
            },
        ]);
    };

    const renderResumeCard = ({ item }) => {
        return (
            <TouchableOpacity style={styles.resumeCard} onPress={() => handleOpenResume(item)} activeOpacity={0.9}>

                <View style={styles.cardHeader}>

                    <View style={styles.resumeInfo}>

                        <View style={styles.resumeIconContainer}>
                            <Text style={styles.resumeIcon}>📄</Text>
                        </View>

                        <View style={styles.resumeDetails}>
                            <Text style={styles.resumeName}>
                                {item.resumeName}
                            </Text>

                            <Text style={styles.uploadDate}>
                                Uploaded {item.uploadedAt}
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => handleDeleteResume(item.resumeId)}
                    >
                        <Ionicons
                            name="trash-outline"
                            size={22}
                            color="#FF4D4F"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.divider} />
                <View style={styles.cardFooter}>

                    <Text style={styles.atsLabel}>
                        ATS Score
                    </Text>

                    <View style={styles.scoreBadge}>
                        <Text style={styles.scoreText}>
                            {item.atsScore}%
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={resumes}
                keyExtractor={(item) => item.resumeId.toString()}
                renderItem={renderResumeCard}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <>
                        <View style={styles.header}>
                            <View style={styles.logoContainer}>
                                <View style={styles.logoCircle}>
                                    <Text style={styles.resumeIcon}>📄</Text>
                                </View>
                            </View>

                            <Text style={styles.title}>My Resumes</Text>

                            <Text style={styles.subtitle}>
                                View and manage your{"\n"}
                                uploaded resumes
                            </Text>
                        </View>

                        <View style={styles.counterContainer}>
                            <Text style={styles.counterTitle}>
                                Uploaded Resumes{' '}
                                <Text style={styles.counterCount}>
                                    ({resumes.length})
                                </Text>
                            </Text>
                        </View>
                    </>
                }
                contentContainerStyle={{
                    paddingBottom: 30,
                }}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>

                        <Text style={styles.emptyIcon}>📄</Text>

                        <Text style={styles.emptyTitle}>
                            No resumes uploaded
                        </Text>

                        <Text style={styles.emptySubtitle}>
                            Upload your first resume{"\n"}
                            to begin ATS analysis.
                        </Text>

                        <TouchableOpacity
                            style={styles.emptyButton}
                            onPress={() => navigation.navigate('HomeTab')}
                        >
                            <Ionicons
                                name="cloud-upload-outline"
                                size={20}
                                color="#FFFFFF"
                            />

                            <Text style={styles.emptyButtonText}>
                                Upload Resume
                            </Text>
                        </TouchableOpacity>

                    </View>
                }
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FF",
    },

    header: {
        backgroundColor: '#5B5FEF',
        height: 240,
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },

    logoContainer: {
        marginBottom: 18,
    },

    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.18)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    resumeIcon: {
        fontSize: 38,
    },

    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
    },

    subtitle: {
        fontSize: 15,
        color: '#E8E8FF',
        textAlign: 'center',
        lineHeight: 22,
    },

    // Resume Counter
    counterContainer: {
        marginTop: 25,
        marginHorizontal: 20,
        marginBottom: 15,
    },

    counterTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#172033',
    },

    counterCount: {
        color: '#5B5FEF',
    },

    // Resume Cards
    resumeCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginBottom: 16,
        padding: 18,
        borderRadius: 20,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 5,
    },

    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    resumeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    resumeIconContainer: {
        width: 55,
        height: 55,
        borderRadius: 15,
        backgroundColor: '#EEF0FF',
        justifyContent: 'center',
        alignItems: 'center',
    },

    resumeIcon: {
        fontSize: 28,
    },

    resumeDetails: {
        marginLeft: 15,
        flex: 1,
    },

    resumeName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#172033',
    },

    uploadDate: {
        marginTop: 4,
        fontSize: 13,
        color: '#7A8194',
    },

    divider: {
        height: 1,
        backgroundColor: '#ECECEC',
        marginVertical: 16,
    },

    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    atsLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#4A5568',
    },

    scoreBadge: {
        backgroundColor: '#22C55E',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
    },

    scoreText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },

    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
        marginTop: 80,
    },

    emptyIcon: {
        fontSize: 70,
        marginBottom: 20,
    },

    emptyTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#172033',
    },

    emptySubtitle: {
        fontSize: 15,
        color: '#7A8194',
        textAlign: 'center',
        marginTop: 10,
        lineHeight: 24,
    },

    emptyButton: {
        marginTop: 30,
        backgroundColor: '#5B5FEF',
        height: 52,
        paddingHorizontal: 28,
        borderRadius: 14,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

        shadowColor: '#5B5FEF',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },

    emptyButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
        marginLeft: 8,
    },
})

export default ResumeTab;
