import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ResultCard from "../../../componants/ResultCard";
import { deleteResume, getAdminResumes } from "../../../api/admin/adminApi";
import { getApiErrorMessage } from "../../../api/apiClient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResumeTab({ navigation }) {
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      try {
        const response = await getAdminResumes();

        setResumes(
          response.data.records.map((resume) => ({
            id: resume.resume_id,
            resume_id: resume.resume_id,
            resumeName: resume.original_name,
            uploadDate: new Date(resume.upload_date).toLocaleDateString(),
            atsScore: resume.ats_score ?? "--",
          })),
        );
      } catch (error) {
        Alert.alert(
          "Error",
          getApiErrorMessage(error, "Unable to load resumes."),
        );
      }
    });

    return unsubscribe;
  }, [navigation]);

  const handleDeleteResume = (resumeId) => {
    Alert.alert(
      "Delete Resume",
      "Are you sure you want to delete this resume?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteResume(resumeId);

              setResumes((previous) =>
                previous.filter((item) => item.resume_id !== resumeId),
              );

              Alert.alert("Success", "Resume deleted successfully.");
            } catch (error) {
              Alert.alert(
                "Error",
                getApiErrorMessage(error, "Unable to delete resume."),
              );
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={resumes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resumeCard}
            onPress={() =>
              navigation.navigate("ResultDetails", {
                resumeId: item.resume_id,
              })
            }
          >
            <View style={styles.resumeLeft}>
              <Ionicons
                name="document-text-outline"
                size={24}
                color="#5B5FEF"
              />

              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.resumeName}>{item.resumeName}</Text>

                <Text style={styles.resumeDate}>
                  Uploaded: {item.uploadDate}
                </Text>
              </View>
            </View>

            <View style={styles.rightContainer}>
              <View style={styles.scoreBadge}>
                <Text style={styles.scoreText}>
                  {item.atsScore === "--" ? "--" : `${item.atsScore}%`}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteResume(item.resume_id)}
              >
                <Ionicons name="trash-outline" size={22} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Resume Management</Text>

              <Text style={styles.headerSubtitle}>
                View all uploaded resumes
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Ionicons name="analytics" size={30} color="#5B5FEF" />
            <Text style={styles.emptyTitle}>No resumes available.</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FF",
  },
  header: {
    height: 240,
    paddingHorizontal: 20,
    paddingTop: 58,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    backgroundColor: "#5B5FEF",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    marginTop: 8,
    fontSize: 15,
    color: "#E8EAFF",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  emptyCard: {
    alignItems: "center",
    marginTop: -36,
    padding: 22,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: "800",
    color: "#172033",
  },

  resumeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
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

  resumeLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  resumeName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#172033",
  },

  resumeDate: {
    marginTop: 5,
    fontSize: 13,
    color: "#7A8194",
  },

  scoreBadge: {
    minWidth: 62,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEF0FF",
  },

  scoreText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#5B5FEF",
  },

  rightContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 12,
  },

  deleteButton: {
    marginTop: 12,
    padding: 4,
  },
});
