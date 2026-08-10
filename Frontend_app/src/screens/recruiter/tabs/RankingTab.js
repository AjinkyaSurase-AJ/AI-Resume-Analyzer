import React, { useEffect, useState } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { getRankings } from "../../../api/recruiter/rankingApi";
import { getApiErrorMessage } from "../../../api/apiClient";
import { Alert } from "react-native";
import { getJobDescriptions } from "../../../api/recruiter/jobDescriptionApi";

function RankingTab({ navigation, route }) {
  const [rankings, setRankings] = useState([]);
  const [selectedJD, setSelectedJD] = useState(null);
  const [jobDescriptions, setJobDescriptions] = useState([]);
  //   const [selectedJD, setSelectedJD] = useState(null);
  const [showJdMenu, setShowJdMenu] = useState(false);

  const normalizeRankings = (records = []) =>
    records.map((item) => ({
      ...item,
      resumeName: item.candidate_resume_name || item.file_name || "Resume",
      score: Number(item.ats_score || 0),
      status: item.quality_label || "Analysis Complete",
    }));

  const loadJobDescriptions = async () => {
    try {
      const response = await getJobDescriptions();

      const records = response.data.records || [];

      setJobDescriptions(records);

      // Coming from Home screen
      if (route.params?.jobDescriptionId) {
        const jd = records.find(
          (item) => item.jd_id === route.params.jobDescriptionId,
        );

        if (jd) {
          setSelectedJD(jd);
        }
      }
    } catch (error) {
      Alert.alert(
        "Error",
        getApiErrorMessage(error, "Unable to load Job Descriptions."),
      );
    }
  };

  const loadRankings = async (jdId = selectedJD?.jd_id) => {
    if (!jdId) return;

    try {
      const response = await getRankings(jdId);

      setRankings(normalizeRankings(response.data));

      const jd = jobDescriptions.find((item) => item.jd_id === jdId);

      if (jd) {
        setSelectedJD(jd);
      }
    } catch (error) {
      Alert.alert(
        "Error",
        getApiErrorMessage(error, "Unable to load rankings."),
      );
    }
  };

  useEffect(() => {
    const loadJobDescriptions = async () => {
      try {
        const response = await getJobDescriptions();
        setJobDescriptions(response.data.records);

        if (!selectedJD && response.data.records.length > 0) {
          setSelectedJD(response.data.records[0]);
        }
      } catch (error) {
        Alert.alert(
          "Error",
          getApiErrorMessage(error, "Unable to load Job Descriptions."),
        );
      }
    };

    loadJobDescriptions();

    const unsubscribe = navigation.addListener("focus", () => {
      loadJobDescriptions();
      loadRankings();
    });

    return unsubscribe;
  }, []);

  const renderRankingCard = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.rankingCard}
        activeOpacity={0.8}
        onPress={() => {
          console.log("Card Clicked");
          navigation.navigate("ResultDetails", {
            resumeId: item.resume_id,
          });
        }}
      >
        <View style={styles.rankingCardTop}>
          <View style={styles.rankLeft}>
            <View style={styles.rankCircle}>
              <Text style={styles.rankText}>{item.rank || index + 1}</Text>
            </View>

            <View style={styles.resumeInfo}>
              <Text style={styles.resumeName}>{item.resumeName}</Text>

              <Text style={styles.resumeStatus}>{item.status}</Text>
            </View>
          </View>

          <View style={styles.scoreBadge}>
            <Text style={styles.scoreBadgeText}>{item.score}%</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={rankings}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderRankingCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <View style={styles.logoCircle}>
                  <Ionicons name="trophy-outline" size={34} color="#FFFFFF" />
                </View>
              </View>

              <Text style={styles.title}>Rankings</Text>

              <Text style={styles.subtitle}>Rank the uploaded resumes</Text>
            </View>

            {/* JD Summary card */}
            <View style={styles.selectedJdCard}>
              <Text style={styles.selectJdLabel}>Select Job Description</Text>

              <TouchableOpacity
                style={styles.selectJdDropdown}
                activeOpacity={0.8}
                onPress={() => setShowJdMenu(!showJdMenu)}
              >
                <Text style={styles.selectJdDropdownText}>
                  {selectedJD?.title || "Select Job Description"}
                </Text>

                <Ionicons
                  name={
                    showJdMenu ? "chevron-up-outline" : "chevron-down-outline"
                  }
                  size={18}
                  color="#6F7687"
                />
              </TouchableOpacity>

              {showJdMenu && (
                <View style={styles.dropdownList}>
                  {jobDescriptions.map((jd) => (
                    <TouchableOpacity
                      key={jd.jd_id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedJD(jd);
                        setShowJdMenu(false);
                        loadRankings(jd.jd_id);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{jd.title}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <View style={styles.selectedJdDivider} />

              <View style={styles.selectedJdBottom}>
                <Text style={styles.selectedJdSummaryLabel}>Total Resumes</Text>

                <Text style={styles.selectedJdSummaryValue}>
                  {rankings.length}
                </Text>
              </View>

              <View style={styles.selectedJdBottom}>
                <Text style={styles.selectedJdSummaryLabel}>
                  Highest ATS Score
                </Text>

                <Text style={styles.selectedJdSummaryValue}>
                  {rankings.length
                    ? `${Math.max(...rankings.map((r) => r.score))}%`
                    : "--"}
                </Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Ranked Candidates</Text>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🏆</Text>

            <Text style={styles.emptyTitle}>No rankings available</Text>

            <Text style={styles.emptySubtitle}>
              Select a Job Description and{"\n"}
              analyze resumes to generate rankings.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

export default RankingTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FF",
  },

  listContainer: {
    paddingBottom: 40,
  },

  header: {
    backgroundColor: "#5B5FEF",
    height: 240,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  logoContainer: {
    marginBottom: 18,
  },

  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    color: "#E8E8FF",
    textAlign: "center",
    lineHeight: 22,
  },

  // JD summary card
  selectedJdCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: -30,
    marginBottom: 16,
    borderRadius: 22,
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

  selectedJdDivider: {
    height: 1,
    backgroundColor: "#ECECEC",
    marginVertical: 14,
  },

  selectedJdBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectedJdSummaryLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3E4658",
  },

  selectedJdSummaryValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#172033",
  },

  sectionTitle: {
    marginHorizontal: 20,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: "800",
    color: "#172033",
  },

  // new
  selectJdLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3E4658",
    marginBottom: 10,
  },

  selectJdDropdown: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#DDE1EC",
    backgroundColor: "#F8F9FD",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectJdDropdownText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#172033",
  },

  dropdownList: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#DDE1EC",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },

  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },

  dropdownItemText: {
    fontSize: 15,
    color: "#172033",
  },

  // Ranking Card
  rankingCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 14,
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },

  rankingCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  rankLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  rankCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EEF0FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  rankText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#5B5FEF",
  },

  resumeInfo: {
    flex: 1,
  },

  resumeName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#172033",
  },

  resumeStatus: {
    marginTop: 4,
    fontSize: 13,
    color: "#7A8194",
  },

  scoreBadge: {
    minWidth: 60,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    backgroundColor: "#DDE1EC",
  },

  scoreBadgeText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    marginTop: 50,
    paddingBottom: 30,
  },

  emptyIcon: {
    fontSize: 68,
    marginBottom: 18,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#172033",
    textAlign: "center",
  },

  emptySubtitle: {
    marginTop: 10,
    fontSize: 15,
    color: "#7A8194",
    textAlign: "center",
    lineHeight: 23,
  },
});
