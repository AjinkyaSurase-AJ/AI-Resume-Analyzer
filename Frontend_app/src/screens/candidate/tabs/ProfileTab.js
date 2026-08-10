import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../../utils/config";
import { getProfile } from "../../../api/candidate/profileApi";

function ProfileTab({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, []),
  );

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfile();
      setProfile(response.data);
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Unable to load profile.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutPress = async () => {
    await AsyncStorage.removeItem(config.KEY_TOKEN);
    await AsyncStorage.removeItem(config.KEY_REMEMBER_ME);
    await AsyncStorage.removeItem("user");
    navigation.replace("Login");
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={[]}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Header Card */}
            <View style={styles.header}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person-outline" size={34} color="#FFFFFF" />
              </View>

              <Text style={styles.title}>{profile?.name || "My Profile"}</Text>

              <Text style={styles.roleText}>{profile?.role || ""}</Text>

              <Text style={styles.subtitle}>
                Manage your account and preferences
              </Text>
            </View>

            {/* Profile Card */}
            <View style={styles.profileCard}>
              <View style={styles.profileCardSection}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Full Name</Text>
                  <Text style={styles.value}>
                    {profile?.full_name || profile?.name}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.label}>Email</Text>
                  <Text style={styles.value}>{profile?.email}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.label}>Role</Text>
                  <Text style={styles.value}>{profile?.role}</Text>
                </View>
              </View>
            </View>

            {/* Action Card */}
            <View style={styles.actionsCard}>
              <TouchableOpacity
                style={styles.actionRow}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("EditProfile")}
              >
                <View style={styles.actionLeft}>
                  <Ionicons name="create-outline" size={20} color="#5B5FEF" />

                  <Text style={styles.actionText}>Edit Profile</Text>
                </View>

                <Ionicons name="chevron-forward" size={18} color="#8A90A6" />
              </TouchableOpacity>

              <View style={styles.actionDivider} />

              <TouchableOpacity
                style={styles.actionRow}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("ChangePassword")}
              >
                <View style={styles.actionLeft}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#5B5FEF"
                  />

                  <Text style={styles.actionText}>Change Password</Text>
                </View>

                <Ionicons name="chevron-forward" size={18} color="#8A90A6" />
              </TouchableOpacity>

              <View style={styles.actionDivider} />

              <View style={styles.actionDivider} />

              <TouchableOpacity
                style={styles.actionRow}
                activeOpacity={0.8}
                onPress={handleLogoutPress}
              >
                <View style={styles.actionLeft}>
                  <Ionicons name="log-out-outline" size={20} color="#EF4444" />

                  <Text style={[styles.actionText, styles.logoutText]}>
                    Logout
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={18} color="#8A90A6" />
              </TouchableOpacity>
            </View>
          </>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FF",
  },

  header: {
    height: 260,
    backgroundColor: "#5B5FEF",
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },

  roleText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#E8E8FF",
    marginBottom: 10,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    color: "#E8E8FF",
    textAlign: "center",
    lineHeight: 22,
  },

  // Profile Card
  profileCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: -30,
    marginBottom: 16,
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },

  profileCardSection: {
    minHeight: 110,
    justifyContent: "center",
  },

  infoRow: {
    marginBottom: 18,
  },

  label: {
    fontSize: 13,
    color: "#8A90A6",
    marginBottom: 4,
  },

  value: {
    fontSize: 16,
    fontWeight: "700",
    color: "#172033",
  },

  // Action Card
  actionsCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },

  actionRow: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  actionText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "700",
    color: "#172033",
  },

  logoutText: {
    color: "#EF4444",
  },

  actionDivider: {
    height: 1,
    backgroundColor: "#ECECEC",
  },
});

export default ProfileTab;
