import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenHeader from "../componants/ScreenHeader";
import { getApiErrorMessage } from "../api/apiClient";
import { getAnalysisResult } from "../api/candidate/analysisApi";

const sections = [{ id: "result-details" }];

export default function ResultDetailsScreen({ navigation, route }) {
  const [result, setResult] = useState(route.params?.result || null);
  const recommendations = result?.recommendations || [];

  const loadDetails = async () => {
    const resumeId = route.params?.resumeId;
    
    if (!resumeId) return;

    try {
      const response = await getAnalysisResult(resumeId);
      
      setResult(response.data);
    } catch (error) {
      Alert.alert(
        "Error",
        getApiErrorMessage(error, "Unable to load analysis."),
      );
    }
  };

  useEffect(() => {
    loadDetails();
  }, []);

  const scoreRows = [
    {
      id: "resume",
      label: "Resume",
      value: result?.resume_name,
    },
    {
      id: "score",
      label: "ATS Score",
      value: `${result?.ats_score || 0}%`,
    },
    {
      id: "quality",
      label: "Quality",
      value: result?.quality_label,
    },
    {
      id: "uploaded",
      label: "Uploaded",
      value: result?.upload_date
        ? new Date(result.upload_date).toLocaleDateString()
        : "--",
    },
  ];
  const renderContent = () => (
    <View>
      <ScreenHeader
        icon="analytics"
        title="Result Details"
        subtitle="Inspect resume analysis output"
        onBack={navigation.goBack}
      />
      <View style={styles.content}>
        <View style={styles.scoreCard}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreText}>
              {result ? `${Number(result.ats_score)}%` : "--"}
            </Text>
          </View>
          <Text style={styles.scoreTitle}>ATS Match Score</Text>
          <Text style={styles.scoreSubtitle}>{result?.summary}</Text>
        </View>
        <View style={styles.card}>
          {scoreRows.map((row) => (
            <View key={row.id} style={styles.row}>
              <Text style={styles.label}>{row.label}</Text>
              <Text style={styles.value}>{row.value}</Text>
            </View>
          ))}
        </View>
        <View style={styles.card}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="bulb" size={20} color="#F59E0B" />
            <Text style={styles.cardTitle}>Recommendations</Text>
          </View>
          {recommendations.length ? (
            recommendations.map((item, index) => (
              <Text key={index} style={styles.bodyText}>
                • {item}
              </Text>
            ))
          ) : (
            <Text style={styles.bodyText}>No recommendations available.</Text>
          )}
        </View>

        {/* Resume Skills */}
        <View style={styles.card}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="document-text-outline" size={20} color="#5B5FEF" />

            <Text style={styles.cardTitle}>Resume Skills</Text>
          </View>

          <View style={styles.skillContainer}>
            {result?.resume_skills?.length ? (
              result.resume_skills.map((skill, index) => (
                <View key={index} style={styles.skillChip}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.bodyText}>No skills found.</Text>
            )}
          </View>
        </View>

        {/* Matched Skills card. */}
        <View style={styles.card}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="checkmark-circle" size={20} color="#22C55E" />

            <Text style={styles.cardTitle}>Matched Skills</Text>
          </View>

          <View style={styles.skillContainer}>
            {result?.matched_skills?.length ? (
              result.matched_skills.map((skill, index) => (
                <View
                  key={index}
                  style={[styles.skillChip, styles.matchedChip]}
                >
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.bodyText}>No matched skills.</Text>
            )}
          </View>
        </View>

        {/* Missing Skills card. */}
        <View style={styles.card}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="close-circle" size={20} color="#EF4444" />

            <Text style={styles.cardTitle}>Missing Skills</Text>
          </View>

          <View style={styles.skillContainer}>
            {result?.missing_skills?.length ? (
              result.missing_skills.map((skill, index) => (
                <View
                  key={index}
                  style={[styles.skillChip, styles.missingChip]}
                >
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.bodyText}>No missing skills.</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FF",
  },
  content: {
    marginTop: -36,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  scoreCard: {
    alignItems: "center",
    padding: 20,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  scoreCircle: {
    width: 92,
    height: 92,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DCFCE7",
  },
  scoreText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#22C55E",
  },
  scoreTitle: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: "800",
    color: "#172033",
  },
  scoreSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#7A8194",
  },
  card: {
    marginTop: 16,
    padding: 18,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },
  label: {
    fontSize: 14,
    color: "#7A8194",
  },
  value: {
    flex: 1,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "800",
    color: "#172033",
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: "800",
    color: "#172033",
  },
  bodyText: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 21,
    color: "#7A8194",
  },

  skillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },

  skillChip: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  matchedChip: {
    backgroundColor: "#DCFCE7",
  },

  missingChip: {
    backgroundColor: "#FEE2E2",
  },

  skillText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#172033",
  },
});
