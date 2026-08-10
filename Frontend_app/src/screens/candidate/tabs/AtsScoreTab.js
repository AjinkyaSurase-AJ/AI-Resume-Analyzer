import React, { useEffect, useState } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";

import { useRoute } from "@react-navigation/native";
import Ionicons from "@react-native-vector-icons/ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { uploadResume } from "../../../api/candidate/resumeApi";
import { formatDate, scoreColor } from "../../../utils/formatters";

function ATSScoreTab({ navigation }) {
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (route.params?.analysis) {
      setAnalysis(route.params.analysis);
    }
  }, [route.params]);

  const resumeSkills = analysis?.resume_skills || [];

  const handleReAnalyze = async () => {
    if (!analysis?.resumeFile) {
      Alert.alert(
        "Resume File Required",
        "Please upload the resume again to run a fresh analysis.",
      );
      navigation.navigate("HomeTab");
      return;
    }

    try {
      setLoading(true);
      const response = await uploadResume(analysis.resumeFile, {
        jd_text: analysis.jobDescription,
        jd_title: analysis.jobDescription ? "Candidate JD" : "Resume Analysis",
      });

      setAnalysis({
        resumeName: resume.name,
        jobDescription,
        analysisDate: new Date().toISOString(),
        ...analysisResponse.data,
      });

      Alert.alert("Success", "Resume analysed successfully.");
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Unable to analyse resume.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!analysis) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Ionicons name="document-text-outline" size={90} color="#C7CBD8" />
        <Text style={styles.emptyTitle}>No Analysis Available</Text>
        <Text style={styles.emptySubtitle}>Upload your resume first.</Text>

        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => navigation.navigate("HomeTab")}
        >
          <Text style={styles.uploadButtonText}>GO TO HOME</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const atsScore = Number(analysis.ats_score ?? analysis.atsScore ?? 0);
  const matchedSkills = analysis.matched_skills || analysis.matchedSkills || [];
  const missingSkills = analysis.missing_skills || analysis.missingSkills || [];
  const recommendations = (analysis.recommendations || [])
    .map((item) => (typeof item === "string" ? item : item.recommendation_text))
    .filter(Boolean);
  const totalKeywords = matchedSkills.length + missingSkills.length;
  const keywordMatch = totalKeywords
    ? Math.round((matchedSkills.length / totalKeywords) * 100)
    : atsScore;
  const currentScoreColor = scoreColor(atsScore);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={[]}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <View style={styles.logoCircle}>
                  <Ionicons
                    name="analytics-outline"
                    size={38}
                    color="#FFFFFF"
                  />
                </View>
              </View>

              <Text style={styles.title}>ATS Analysis</Text>

              <Text style={styles.subtitle}>
                See how your resume{"\n"}
                performs
              </Text>
            </View>

            <View style={styles.resumeCard}>
              <View style={styles.resumeHeader}>
                <View style={styles.resumeIconContainer}>
                  <Ionicons
                    name="document-text-outline"
                    size={30}
                    color="#5B5FEF"
                  />
                </View>

                <View style={styles.resumeDetails}>
                  <Text style={styles.resumeName}>
                    {analysis.resumeName ||
                      analysis.original_name ||
                      "Uploaded Resume"}
                  </Text>

                  <Text style={styles.resumeDate}>
                    Analysed {formatDate(analysis.analysisDate)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.scoreSection}>
              <View
                style={[styles.scoreCircle, { borderColor: currentScoreColor }]}
              >
                <Text style={[styles.scoreValue, { color: currentScoreColor }]}>
                  {Math.round(atsScore)}%
                </Text>

                <Text style={styles.scoreLabel}>ATS Score</Text>
              </View>

              <Text style={[styles.scoreStatus, { color: currentScoreColor }]}>
                {analysis.quality_label || "Analysis Complete"}
              </Text>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Resume Summary</Text>

              <Text style={styles.summaryText}>
                {analysis.summary ||
                  analysis.quality_label ||
                  "No summary returned by the backend."}
              </Text>
            </View>

            <View style={styles.keywordCard}>
              <Text style={styles.cardTitle}>Keyword Match</Text>

              <View style={styles.keywordProgressTrack}>
                <View
                  style={[
                    styles.keywordProgressFill,
                    { width: `${keywordMatch}%` },
                  ]}
                />
              </View>

              <Text style={styles.keywordPercentage}>
                {keywordMatch}% keyword match
              </Text>

              <Text style={styles.keywordDescription}>
                {matchedSkills.length} matched skill(s), {missingSkills.length}{" "}
                missing skill(s)
              </Text>
            </View>

            <View style={styles.skillsCard}>
              <Text style={styles.cardTitle}>Resume Skills</Text>
              <View style={styles.skillsContainer}>
                {resumeSkills.map((skill, index) => (
                  <View key={index} style={styles.skillChip}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.skillsCard}>
              <Text style={styles.cardTitle}>Missing Skills</Text>

              <View style={styles.skillsContainer}>
                {missingSkills.length ? (
                  missingSkills.map((skill) => (
                    <View key={skill} style={styles.skillChip}>
                      <Text style={styles.skillChipText}>{skill}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.emptyText}>
                    No missing skills returned.
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.suggestionsCard}>
              <Text style={styles.cardTitle}>Improvement Suggestions</Text>

              {recommendations.length ? (
                recommendations.map((recommendation, index) => (
                  <View
                    key={`${recommendation}-${index}`}
                    style={styles.suggestionItem}
                  >
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={18}
                      color="#22C55E"
                    />
                    <Text style={styles.suggestionText}>{recommendation}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>
                  No recommendations returned.
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.reanalyzeButton}
              activeOpacity={0.85}
              onPress={() => navigation.jumpTo("HomeTab")}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.reanalyzeButtonText}>
                  Analyze Another Resume
                </Text>
              )}
            </TouchableOpacity>

            <Text style={styles.footerText}>
              Generated {formatDate(analysis.analysisDate)}
            </Text>
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
    height: 240,
    backgroundColor: "#5B5FEF",
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
  },

  subtitle: {
    fontSize: 15,
    color: "#E8E8FF",
    textAlign: "center",
    lineHeight: 22,
  },

  resumeCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: -30,
    marginBottom: 20,
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },

  resumeHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  resumeIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: "#EEF0FF",
    justifyContent: "center",
    alignItems: "center",
  },

  resumeDetails: {
    flex: 1,
    marginLeft: 15,
  },

  resumeName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#172033",
  },

  resumeDate: {
    marginTop: 5,
    fontSize: 13,
    color: "#7A8194",
  },

  scoreSection: {
    alignItems: "center",
    marginBottom: 18,
  },

  scoreCircle: {
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },

  scoreValue: {
    fontSize: 42,
    fontWeight: "900",
  },

  scoreLabel: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "800",
    color: "#7A8194",
  },

  scoreStatus: {
    marginTop: 12,
    marginHorizontal: 24,
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
  },

  summaryCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },

  summaryTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#172033",
    marginBottom: 10,
  },

  summaryText: {
    fontSize: 14,
    color: "#5F6678",
    lineHeight: 22,
  },

  keywordCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#172033",
    marginBottom: 14,
  },

  keywordProgressTrack: {
    height: 14,
    backgroundColor: "#E9ECF5",
    borderRadius: 999,
    overflow: "hidden",
  },

  keywordProgressFill: {
    height: "100%",
    backgroundColor: "#5B5FEF",
    borderRadius: 999,
  },

  keywordPercentage: {
    fontSize: 16,
    fontWeight: "800",
    color: "#172033",
    marginTop: 12,
  },

  keywordDescription: {
    fontSize: 13,
    color: "#7A8194",
    marginTop: 6,
    lineHeight: 19,
  },

  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },

  skillChip: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },

  skillText: {
    color: "#2E7D32",
    fontWeight: "600",
  },

  skillsCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },

  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  skillChip: {
    backgroundColor: "#F1F1FF",
    borderWidth: 1,
    borderColor: "#CFCBFF",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  skillChipText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#5B5FEF",
  },

  emptyText: {
    fontSize: 14,
    color: "#7A8194",
    lineHeight: 21,
  },

  suggestionsCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },

  suggestionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },

  suggestionText: {
    flex: 1,
    fontSize: 14,
    color: "#3E4658",
    lineHeight: 21,
    marginLeft: 10,
  },

  reanalyzeButton: {
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 14,
    height: 54,
    borderRadius: 14,
    backgroundColor: "#5B5FEF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5B5FEF",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },

  reanalyzeButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.7,
  },

  footerText: {
    textAlign: "center",
    fontSize: 12,
    color: "#7A8194",
    marginBottom: 24,
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FF",
    paddingHorizontal: 30,
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#172033",
    marginTop: 20,
    textAlign: "center",
  },

  emptySubtitle: {
    fontSize: 15,
    color: "#7A8194",
    textAlign: "center",
    lineHeight: 24,
    marginTop: 10,
  },

  uploadButton: {
    marginTop: 30,
    width: "100%",
    height: 54,
    borderRadius: 14,
    backgroundColor: "#5B5FEF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#5B5FEF",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },

  uploadButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.6,
  },
});

export default ATSScoreTab;
