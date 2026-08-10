import React, { useEffect, useState } from 'react';
import {
    FlatList,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-paper';
import {
    createJobDescription,
    deleteJobDescription,
    getJobDescriptions,
} from '../../../api/recruiter/jobDescriptionApi';
import { getApiErrorMessage } from '../../../api/apiClient';

function JobDescriptionTab({ navigation }) {

    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [jobDescriptions, setJobDescriptions] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadJobDescriptions = async () => {
        try {
            const response = await getJobDescriptions();
            setJobDescriptions(response.data.records.map((item) => ({
                ...item,
                jdId: item.jd_id,
                jobTitle: item.title,
                createdAt: new Date(item.upload_date).toLocaleDateString(),
            })));
        } catch (error) {
            Alert.alert('Error', getApiErrorMessage(error, 'Unable to load job descriptions.'));
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', loadJobDescriptions);
        return unsubscribe;
    }, [navigation]);

    const resetForm = () => {
        setJobTitle('');
        setJobDescription('');
    };

    const handleCreateJD = async () => {
        if (!jobTitle.trim() || !jobDescription.trim()) {
            Alert.alert('Validation', 'Job title and job description are required.');
            return;
        }

        try {
            setLoading(true);
            await createJobDescription({
                title: jobTitle.trim(),
                description: jobDescription.trim(),
            });
            resetForm();
            await loadJobDescriptions();
            Alert.alert('Success', 'Job description created successfully.');
        } catch (error) {
            Alert.alert('Error', getApiErrorMessage(error, 'Unable to create job description.'));
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteJD = (jdId) => {
        Alert.alert(
            'Delete Job Description',
            'Are you sure you want to delete this Job Description?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteJobDescription(jdId);
                            await loadJobDescriptions();
                        } catch (error) {
                            Alert.alert('Error', getApiErrorMessage(error, 'Unable to delete job description.'));
                        }
                    },
                },
            ],
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={[]}
                keyExtractor={(_, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                ListHeaderComponent={
                    <>
                        <View style={styles.header}>
                            <View style={styles.logoContainer}>
                                <View style={styles.logoCircle}>
                                    <Text style={styles.headerIcon}>📋</Text>
                                </View>
                            </View>

                            <Text style={styles.title}>Job Descriptions</Text>

                            <Text style={styles.subtitle}>
                                Create and manage your{"\n"}
                                job descriptions
                            </Text>
                        </View>

                        <View style={styles.createCard}>
                            <Text style={styles.cardTitle}>Create Job Description</Text>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Job Title</Text>
                                <TextInput
                                    style={styles.inputBox}
                                    placeholder="Enter job title"
                                    placeholderTextColor="#9AA0B4"
                                    value={jobTitle}
                                    onChangeText={setJobTitle}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Job Description</Text>
                                <TextInput
                                    style={styles.textAreaBox}
                                    placeholder="Paste or type the complete job description..."
                                    placeholderTextColor="#9AA0B4"
                                    multiline
                                    textAlignVertical="top"
                                    value={jobDescription}
                                    onChangeText={setJobDescription}
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.createButton}
                                activeOpacity={0.85}
                                onPress={handleCreateJD}
                            >
                                <Text style={styles.createButtonText}>
                                    {loading ? 'CREATING...' : 'CREATE JD'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.listTitleContainer}>
                            <Text style={styles.listTitle}>Created Job Descriptions</Text>
                        </View>

                        {/* JD Card */}
                        <FlatList
                            data={jobDescriptions}
                            keyExtractor={(item) => item.jdId.toString()}
                            scrollEnabled={false}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    style={styles.jdCard}
                                    onPress={() => Alert.alert(
                                        item.jobTitle,
                                        item.description || 'No description available.'
                                    )}
                                >
                                    <View style={styles.jdCardTop}>

                                        <View style={styles.jdLeftSection}>

                                            <View style={styles.jdIconContainer}>
                                                <Ionicons
                                                    name="document-text-outline"
                                                    size={22}
                                                    color="#5B5FEF"
                                                />
                                            </View>

                                            <View>

                                                <Text style={styles.jdTitle}>
                                                    {item.jobTitle}
                                                </Text>

                                                <Text style={styles.jdDate}>
                                                    Created {item.createdAt}
                                                </Text>

                                            </View>

                                        </View>

                                        <View style={styles.jdActions}>

                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                onPress={() => Alert.alert(
                                                    item.jobTitle,
                                                    item.description || 'No description available.'
                                                )}
                                            >
                                                <Ionicons
                                                    name="create-outline"
                                                    size={22}
                                                    color="#5B5FEF"
                                                />
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                style={styles.deleteButton}
                                                onPress={() => handleDeleteJD(item.jdId)}
                                            >
                                                <Ionicons
                                                    name="trash-outline"
                                                    size={22}
                                                    color="#EF4444"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>📋</Text>
                        <Text style={styles.emptyTitle}>No job descriptions created</Text>
                        <Text style={styles.emptySubtitle}>
                            Create your first job description{"\n"}
                            to start ranking candidates.
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FF',
    },

    listContainer: {
        paddingBottom: 40,
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

    headerIcon: {
        fontSize: 36,
    },

    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
    },

    subtitle: {
        fontSize: 15,
        color: '#E8E8FF',
        textAlign: 'center',
        lineHeight: 22,
    },

    createCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginTop: -30,
        marginBottom: 16,
        borderRadius: 22,
        padding: 18,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 5,
    },

    cardTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#172033',
        marginBottom: 16,
    },

    inputGroup: {
        marginBottom: 14,
    },

    inputLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#3E4658',
        marginBottom: 10,
    },

    inputBox: {
        height: 52,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#DDE1EC',
        backgroundColor: '#F8F9FD',
        paddingHorizontal: 16,
        fontSize: 15,
        color: '#172033',
    },

    textAreaBox: {
        minHeight: 150,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#DDE1EC',
        backgroundColor: '#F8F9FD',
        paddingHorizontal: 16,
        paddingTop: 14,
        fontSize: 15,
        color: '#172033',
    },

    createButton: {
        marginTop: 6,
        height: 54,
        borderRadius: 14,
        backgroundColor: '#5B5FEF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#5B5FEF',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },

    createButtonText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.7,
    },

    listTitleContainer: {
        marginHorizontal: 20,
        marginBottom: 12,
    },

    listTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#172033',
    },

    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
        marginTop: 40,
    },

    emptyIcon: {
        fontSize: 68,
        marginBottom: 18,
    },

    emptyTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#172033',
        textAlign: 'center',
    },

    emptySubtitle: {
        fontSize: 15,
        color: '#7A8194',
        textAlign: 'center',
        lineHeight: 23,
        marginTop: 10,
    },

    //JD Card
    jdCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 14,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 5,
    },

    jdCardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    jdLeftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    jdIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: '#EEF0FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },

    jdTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#172033',
    },

    jdDate: {
        marginTop: 4,
        fontSize: 13,
        color: '#7A8194',
    },

    jdActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    deleteButton: {
        marginLeft: 18,
    },
});

export default JobDescriptionTab;
