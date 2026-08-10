import React, { useState } from 'react';

import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import {
    ActivityIndicator,
    Button,
    RadioButton,
    TextInput,
} from 'react-native-paper';

import Ionicons from '@react-native-vector-icons/ionicons';
import Toast from 'react-native-toast-message';
import { registerUser } from '../../api/userService';

function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('candidate');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        if (!name.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Name Required',
                text2: 'Please enter your full name.',
            });

            return false;
        }

        if (name.trim().length < 3) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Name',
                text2: 'Name must contain at least 3 characters.',
            });

            return false;
        }

        if (!email.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Email Required',
                text2: 'Please enter your email address.',
            });

            return false;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email.trim())) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Email',
                text2: 'Please enter a valid email address.',
            });

            return false;
        }

        if (!role) {
            Toast.show({
                type: 'error',
                text1: 'Role Required',
                text2: 'Please select Candidate or Recruiter.',
            });

            return false;
        }

        if (!password) {
            Toast.show({
                type: 'error',
                text1: 'Password Required',
                text2: 'Please enter your password.',
            });

            return false;
        }

        if (password.length < 6) {
            Toast.show({
                type: 'error',
                text1: 'Weak Password',
                text2: 'Password must contain at least 6 characters.',
            });

            return false;
        }

        if (!confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Confirm Password',
                text2: 'Please confirm your password.',
            });

            return false;
        }

        if (password !== confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Passwords Do Not Match',
                text2: 'Password and confirm password must be the same.',
            });

            return false;
        }

        return true;
    };

    const handleRegister = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setIsLoading(true);

            const registrationData = {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                role,
                password,
            };

            console.log('Registration data:', registrationData);

            const body = { name, email, password, role }
            const response = await registerUser(body)
            if (response.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Registration Successful',
                    text2: 'Your account has been created.',
                })

                navigation.goBack()
            }
        } catch (error) {
            console.log('Registration error:', error);

            Toast.show({
                type: 'error',
                text1: 'Registration Failed',
                text2:
                    error.response?.data?.message ||
                    error.message ||
                    'Something went wrong. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginPress = () => {
        
        navigation.replace('Login')

        Toast.show({
            type: 'info',
            text1: 'Login',
        });
    };

    return (
        <View style={styles.mainContainer}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="#5B5FEF"
            />

            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={0}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="always"
                    keyboardDismissMode="none"
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                >
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <Ionicons
                                name="person-add-outline"
                                size={48}
                                color="#FFFFFF"
                            />

                            <View style={styles.sparkleContainer}>
                                <Ionicons
                                    name="sparkles"
                                    size={20}
                                    color="#FFE066"
                                />
                            </View>
                        </View>

                        <Text style={styles.appTitle}>
                            Create Account
                        </Text>

                        <Text style={styles.appSubtitle}>
                            Join AI Resume Analyzer and improve your career
                        </Text>
                    </View>

                    <View style={styles.formSection}>
                        <View style={styles.registrationCard}>
                            <Text style={styles.cardTitle}>
                                Get Started
                            </Text>

                            <Text style={styles.cardSubtitle}>
                                Enter your details to create an account
                            </Text>

                            <TextInput
                                label="Full Name"
                                value={name}
                                onChangeText={setName}
                                mode="outlined"
                                autoCapitalize="words"
                                autoCorrect={false}
                                editable={!isLoading}
                                placeholder="Enter your full name"
                                outlineColor="#DDE1EC"
                                activeOutlineColor="#5B5FEF"
                                textColor="#172033"
                                style={styles.input}
                                contentStyle={styles.inputContent}
                                left={
                                    <TextInput.Icon
                                        icon={() => (
                                            <Ionicons
                                                name="person-outline"
                                                size={21}
                                                color="#6F7687"
                                            />
                                        )}
                                    />
                                }
                                theme={{
                                    roundness: 14,
                                    colors: {
                                        background: '#F8F9FD',
                                    },
                                }}
                            />

                            <TextInput
                                label="Email Address"
                                value={email}
                                onChangeText={setEmail}
                                mode="outlined"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                editable={!isLoading}
                                placeholder="Enter your email address"
                                outlineColor="#DDE1EC"
                                activeOutlineColor="#5B5FEF"
                                textColor="#172033"
                                style={styles.input}
                                contentStyle={styles.inputContent}
                                left={
                                    <TextInput.Icon
                                        icon={() => (
                                            <Ionicons
                                                name="mail-outline"
                                                size={21}
                                                color="#6F7687"
                                            />
                                        )}
                                    />
                                }
                                theme={{
                                    roundness: 14,
                                    colors: {
                                        background: '#F8F9FD',
                                    },
                                }}
                            />

                            <Text style={styles.roleLabel}>
                                Select Account Type
                            </Text>

                            <RadioButton.Group
                                value={role}
                                onValueChange={setRole}
                            >
                                <View style={styles.roleContainer}>
                                    <TouchableOpacity
                                        style={[
                                            styles.roleCard,
                                            role === 'candidate' &&
                                            styles.selectedRoleCard,
                                        ]}
                                        onPress={() => setRole('candidate')}
                                        activeOpacity={0.8}
                                        disabled={isLoading}
                                    >
                                        <Ionicons
                                            name="document-text-outline"
                                            size={26}
                                            color={
                                                role === 'candidate'
                                                    ? '#5B5FEF'
                                                    : '#7A8194'
                                            }
                                        />

                                        <View style={styles.roleTextContainer}>
                                            <Text
                                                style={[
                                                    styles.roleTitle,
                                                    role === 'candidate' &&
                                                    styles.selectedRoleTitle,
                                                ]}
                                            >
                                                Candidate
                                            </Text>

                                            <Text style={styles.roleDescription}>
                                                Analyse and improve your resume
                                            </Text>
                                        </View>

                                        <RadioButton
                                            value="candidate"
                                            color="#5B5FEF"
                                            uncheckedColor="#9AA1B1"
                                            disabled={isLoading}
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            styles.roleCard,
                                            role === 'recruiter' &&
                                            styles.selectedRoleCard,
                                        ]}
                                        onPress={() => setRole('recruiter')}
                                        activeOpacity={0.8}
                                        disabled={isLoading}
                                    >
                                        <Ionicons
                                            name="briefcase-outline"
                                            size={26}
                                            color={
                                                role === 'recruiter'
                                                    ? '#5B5FEF'
                                                    : '#7A8194'
                                            }
                                        />

                                        <View style={styles.roleTextContainer}>
                                            <Text
                                                style={[
                                                    styles.roleTitle,
                                                    role === 'recruiter' &&
                                                    styles.selectedRoleTitle,
                                                ]}
                                            >
                                                Recruiter
                                            </Text>

                                            <Text style={styles.roleDescription}>
                                                Find and rank suitable candidates
                                            </Text>
                                        </View>

                                        <RadioButton
                                            value="recruiter"
                                            color="#5B5FEF"
                                            uncheckedColor="#9AA1B1"
                                            disabled={isLoading}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </RadioButton.Group>

                            <TextInput
                                label="Password"
                                value={password}
                                onChangeText={setPassword}
                                mode="outlined"
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                                editable={!isLoading}
                                placeholder="Create a password"
                                outlineColor="#DDE1EC"
                                activeOutlineColor="#5B5FEF"
                                textColor="#172033"
                                style={styles.input}
                                contentStyle={styles.inputContent}
                                left={
                                    <TextInput.Icon
                                        icon={() => (
                                            <Ionicons
                                                name="lock-closed-outline"
                                                size={21}
                                                color="#6F7687"
                                            />
                                        )}
                                    />
                                }
                                right={
                                    <TextInput.Icon
                                        icon={() => (
                                            <Ionicons
                                                name={
                                                    showPassword
                                                        ? 'eye-off-outline'
                                                        : 'eye-outline'
                                                }
                                                size={22}
                                                color="#6F7687"
                                            />
                                        )}
                                        onPress={() =>
                                            setShowPassword(previous => !previous)
                                        }
                                    />
                                }
                                theme={{
                                    roundness: 14,
                                    colors: {
                                        background: '#F8F9FD',
                                    },
                                }}
                            />

                            <TextInput
                                label="Confirm Password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                mode="outlined"
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                                editable={!isLoading}
                                placeholder="Re-enter your password"
                                outlineColor="#DDE1EC"
                                activeOutlineColor="#5B5FEF"
                                textColor="#172033"
                                style={styles.input}
                                contentStyle={styles.inputContent}
                                onSubmitEditing={handleRegister}
                                left={
                                    <TextInput.Icon
                                        icon={() => (
                                            <Ionicons
                                                name="shield-checkmark-outline"
                                                size={21}
                                                color="#6F7687"
                                            />
                                        )}
                                    />
                                }
                                right={
                                    <TextInput.Icon
                                        icon={() => (
                                            <Ionicons
                                                name={
                                                    showConfirmPassword
                                                        ? 'eye-off-outline'
                                                        : 'eye-outline'
                                                }
                                                size={22}
                                                color="#6F7687"
                                            />
                                        )}
                                        onPress={() =>
                                            setShowConfirmPassword(
                                                previous => !previous
                                            )
                                        }
                                    />
                                }
                                theme={{
                                    roundness: 14,
                                    colors: {
                                        background: '#F8F9FD',
                                    },
                                }}
                            />

                            <Text style={styles.passwordHint}>
                                Password must contain at least 6 characters.
                            </Text>

                            <Button
                                mode="contained"
                                onPress={handleRegister}
                                disabled={isLoading}
                                buttonColor="#5B5FEF"
                                textColor="#FFFFFF"
                                style={styles.registerButton}
                                contentStyle={styles.buttonContent}
                                labelStyle={styles.registerButtonText}
                            >
                                {isLoading ? (
                                    <ActivityIndicator
                                        size="small"
                                        color="#FFFFFF"
                                    />
                                ) : (
                                    'CREATE ACCOUNT'
                                )}
                            </Button>

                            <View style={styles.loginContainer}>
                                <Text style={styles.loginQuestion}>
                                    Already have an account?
                                </Text>

                                <TouchableOpacity
                                    onPress={handleLoginPress}
                                    disabled={isLoading}
                                >
                                    <Text style={styles.loginText}>
                                        Sign In
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Text style={styles.footerText}>
                            Candidate
                            <Text style={styles.dotText}> • </Text>
                            Recruiter
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#F5F7FF',
    },

    keyboardContainer: {
        flex: 1,
    },

    scrollView: {
        flex: 1,
    },

    scrollContainer: {
        flexGrow: 1,
        backgroundColor: '#F5F7FF',
        paddingBottom: 40,
    },

    header: {
        minHeight: 285,
        backgroundColor: '#5B5FEF',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingTop: 35,
        paddingBottom: 72,
        borderBottomLeftRadius: 42,
        borderBottomRightRadius: 42,
    },

    logoContainer: {
        width: 88,
        height: 88,
        borderRadius: 27,
        backgroundColor: 'rgba(255, 255, 255, 0.18)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.35)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 17,
    },

    sparkleContainer: {
        position: 'absolute',
        top: 9,
        right: 9,
    },

    appTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'center',
    },

    appSubtitle: {
        fontSize: 14,
        color: '#E6E7FF',
        textAlign: 'center',
        marginTop: 9,
        lineHeight: 21,
    },

    formSection: {
        paddingHorizontal: 19,
        paddingBottom: 40,
        marginTop: -48,
    },

    registrationCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        paddingHorizontal: 21,
        paddingTop: 28,
        paddingBottom: 26,
        shadowColor: '#1E245F',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.14,
        shadowRadius: 16,
        elevation: 8,
    },

    cardTitle: {
        fontSize: 25,
        fontWeight: '800',
        color: '#172033',
        textAlign: 'center',
    },

    cardSubtitle: {
        fontSize: 14,
        color: '#7A8194',
        textAlign: 'center',
        marginTop: 7,
        marginBottom: 24,
    },

    input: {
        backgroundColor: '#F8F9FD',
        marginBottom: 17,
        fontSize: 15,
    },

    inputContent: {
        minHeight: 55,
    },

    roleLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#3E4658',
        marginBottom: 10,
    },

    roleContainer: {
        marginBottom: 17,
        gap: 11,
    },

    roleCard: {
        minHeight: 76,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 13,
        paddingVertical: 10,
        backgroundColor: '#F8F9FD',
        borderWidth: 1.3,
        borderColor: '#DDE1EC',
        borderRadius: 14,
    },

    selectedRoleCard: {
        backgroundColor: '#F1F1FF',
        borderColor: '#5B5FEF',
    },

    roleTextContainer: {
        flex: 1,
        marginLeft: 12,
    },

    roleTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#3E4658',
    },

    selectedRoleTitle: {
        color: '#5B5FEF',
    },

    roleDescription: {
        fontSize: 12,
        color: '#7A8194',
        marginTop: 3,
    },

    passwordHint: {
        fontSize: 12,
        color: '#7A8194',
        marginTop: -7,
        marginBottom: 20,
        marginLeft: 3,
    },

    registerButton: {
        borderRadius: 14,
        shadowColor: '#5B5FEF',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },

    buttonContent: {
        height: 56,
    },

    registerButtonText: {
        fontSize: 15,
        fontWeight: '800',
        letterSpacing: 0.7,
    },

    loginContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 22,
    },

    loginQuestion: {
        fontSize: 14,
        color: '#687083',
    },

    loginText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#5B5FEF',
        marginLeft: 5,
    },

    footerText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#687083',
        textAlign: 'center',
        marginTop: 23,
    },

    dotText: {
        color: '#5B5FEF',
    },
});

export default RegisterScreen;