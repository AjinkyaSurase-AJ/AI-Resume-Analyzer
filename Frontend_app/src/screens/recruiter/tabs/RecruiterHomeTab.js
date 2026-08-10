import Ionicons from "@react-native-vector-icons/ionicons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import { TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { pickMultipleResumes } from "../../../services/documentPickerService";
import { getJobDescriptions } from "../../../api/recruiter/jobDescriptionApi";
import {
  analyzeRecruiterResumes,
  rankResumesForJob,
} from "../../../api/recruiter/rankingApi";
import { getApiErrorMessage } from "../../../api/apiClient";

function RecruiterHomeTab({ navigation }) {
  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [selectedJobDescription, setSelectedJobDescription] = useState(null);
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [selectedResumes, setSelectedResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showJdMenu, setShowJdMenu] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      try {
        const response = await getJobDescriptions();
        setJobDescriptions(response.data.records);
      } catch (error) {
        Alert.alert(
          "Error",
          getApiErrorMessage(error, "Unable to load job descriptions."),
        );
      }
    });
    return unsubscribe;
  }, [navigation]);

  const handleSelectJobDescription = () => {
    if (!jobDescriptions.length) {
      Alert.alert(
        "Job Descriptions",
        "No saved job descriptions are available.",
      );
      return;
    }

    setShowJdMenu(true);
  };

  const handleSelectResumes = async () => {
    try {
      const files = await pickMultipleResumes(
        Boolean(jobDescriptionText.trim()),
      );
      const maximumFiles = jobDescriptionText.trim() ? 5 : 20;
      const totalFiles = selectedResumes.length + files.length;

      if (totalFiles > maximumFiles) {
        Alert.alert(
          "Validation",
          `You can select a maximum of ${maximumFiles} resumes.`,
        );
        return;
      }
      setSelectedResumes((previousResumes) => {
        const mergedResumes = [...previousResumes, ...files];

        const uniqueResumes = mergedResumes.filter(
          (resume, index, self) =>
            index === self.findIndex((item) => item.uri === resume.uri),
        );

        return uniqueResumes;
      });
    } catch (error) {
      Alert.alert("Error", "Unable to select resume files.");
    }
  };

  const removeResume = (uri) => {
    setSelectedResumes((previousResumes) =>
      previousResumes.filter((resume) => resume.uri !== uri),
    );
  };

  const handleAnalyzeResumes = async () => {
    if (!selectedResumes.length) {
      Alert.alert("Validation", "Please select at least one resume.");
      return;
    }
    if (!selectedJobDescription && !jobDescriptionText.trim()) {
      Alert.alert("Validation", "Select a saved job description or enter one.");
      return;
    }

    try {
      setLoading(true);
      let response;
      let jobDescriptionId;
      let rankings;

      if (jobDescriptionText.trim()) {
        response = await analyzeRecruiterResumes(
          selectedResumes,
          jobDescriptionText,
          selectedJobDescription?.title || "",
        );
        jobDescriptionId = response.data.jd_id;
        rankings = response.data.candidates;
      } else {
        response = await rankResumesForJob(
          selectedJobDescription.jd_id,
          selectedResumes,
        );
        jobDescriptionId = selectedJobDescription.jd_id;
        rankings = response.data;
      }

      navigation.navigate("Rankings", {
        jobDescriptionId,
        jobDescriptionTitle: selectedJobDescription?.title || "Job Description",
        rankings,
      });
    } catch (error) {
      Alert.alert(
        "Error",
        getApiErrorMessage(error, "Unable to analyze resumes."),
      );
    } finally {
      setLoading(false);
    }
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
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <View style={styles.logoCircle}>
                  <Text style={styles.headerIcon}>👥</Text>
                </View>
              </View>

              <Text style={styles.title}>AI Resume Analyzer</Text>

              <Text style={styles.subtitle}>
                Analyze multiple resumes{"\n"}
                against a Job Description
              </Text>
            </View>

            {/* Floating Card */}
            <View style={styles.analysisCard}>
              <Text style={styles.analysisTitle}>Bulk Resume Analysis</Text>

              <Text style={styles.analysisSubtitle}>
                Upload resumes and compare{"\n"}
                them with a Job Description.
              </Text>
            </View>

            {/* Job Discription */}
            <View style={styles.jdSection}>
              <Text style={styles.sectionTitle}>Job Description</Text>

              <View style={styles.selectJdBox}>
                <Text style={styles.selectJdLabel}>Select Existing JD</Text>

                <TouchableOpacity
                  style={styles.selectJdDropdown}
                  activeOpacity={0.8}
                  onPress={() => setShowJdMenu(!showJdMenu)}
                >
                  <Text style={styles.selectJdDropdownText}>
                    {selectedJobDescription?.title || "Select an existing JD"}
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
                  <TouchableWithoutFeedback
                    onPress={() => setShowJdMenu(false)}
                  >
                    <FlatList
                      style={styles.dropdownList}
                      data={jobDescriptions}
                      keyExtractor={(item) => item.jd_id.toString()}
                      nestedScrollEnabled
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.dropdownItem}
                          onPress={() => {
                            setSelectedJobDescription(item);
                            setJobDescriptionText("");
                            setShowJdMenu(false);
                          }}
                        >
                          <Text style={styles.dropdownItemText}>
                            {item.title}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </TouchableWithoutFeedback>
                )}
              </View>

              <View style={styles.jdOptionalSection}>
                <Text style={styles.inputLabel}>
                  Paste / Type JD{" "}
                  <Text style={styles.optionalText}>(Optional)</Text>
                </Text>

                <View>
                  <TextInput
                    mode="outlined"
                    placeholder="Paste the job description here..."
                    multiline
                    numberOfLines={10}
                    style={styles.jdInput}
                    outlineColor="#DDE1EC"
                    activeOutlineColor="#5B5FEF"
                    placeholderTextColor="#8A90A6"
                    value={jobDescriptionText}
                    onChangeText={(text) => {
                      setJobDescriptionText(text);

                      if (text.trim()) {
                        setSelectedJobDescription(null);
                        setShowJdMenu(false);
                      }
                    }}
                  />
                </View>
              </View>
            </View>

            {/* Upload Resume */}
            <View style={styles.uploadSection}>
              <View style={styles.uploadBox}>
                <View style={styles.uploadIconCircle}>
                  <Text style={styles.uploadIcon}>☁</Text>
                </View>

                <Text style={styles.uploadTitle}>Upload Candidate Resumes</Text>

                <Text style={styles.uploadText}>Browse Files</Text>

                <Text style={styles.fileTypes}>PDF • DOC • DOCX</Text>

                <TouchableOpacity
                  style={styles.browseButton}
                  activeOpacity={0.85}
                  onPress={handleSelectResumes}
                >
                  <Text style={styles.browseButtonText}>
                    SELECT RESUME FILES
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* Selected Resumes */}
            <View style={styles.selectedResumesCard}>
              <Text style={styles.sectionTitle}>Selected Resumes</Text>

              {selectedResumes.length === 0 ? (
                <Text style={styles.selectJdDropdownText}>
                  No files selected
                </Text>
              ) : (
                selectedResumes.map((resume) => (
                  <View key={resume.uri} style={styles.resumeRow}>
                    <Ionicons
                      name="document-text-outline"
                      size={22}
                      color="#5B5FEF"
                    />

                    <Text style={styles.resumeName} numberOfLines={1}>
                      {resume.name}
                    </Text>

                    <TouchableOpacity onPress={() => removeResume(resume.uri)}>
                      <Ionicons
                        name="trash-outline"
                        size={22}
                        color="#EF4444"
                      />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>

            {/* Analyze Button */}
            <TouchableOpacity
              style={styles.analyzeButton}
              activeOpacity={0.85}
              onPress={handleAnalyzeResumes}
              disabled={loading}
            >
              <Text style={styles.analyzeButtonText}>
                {loading ? "ANALYZING..." : "ANALYZE ALL RESUMES"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.supportedFormatsTitle}>Supported formats</Text>

            <Text style={styles.supportedFormatsText}>
              PDF • DOC • DOCX{"\n"}
              Maximum Size : 5 MB
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

  headerIcon: {
    fontSize: 36,
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

  analysisCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: -30,
    marginBottom: 20,
    borderRadius: 22,
    padding: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },

  analysisTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#172033",
    marginBottom: 8,
  },

  analysisSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 22,
  },

  // Job Discription
  jdSection: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
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

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#172033",
    marginBottom: 14,
  },

  selectJdBox: {
    marginBottom: 16,
  },

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
    fontSize: 14,
    fontWeight: "700",
    color: "#172033",
    flex: 1,
    marginRight: 10,
  },

  resumeRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },

  resumeName: {
    flex: 1,
    marginHorizontal: 12,
    fontSize: 15,
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

  jdOptionalSection: {
    marginTop: 2,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3E4658",
    marginBottom: 10,
  },

  optionalText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#7A8194",
  },

  jdInput: {
    backgroundColor: "#F8F9FD",
    borderRadius: 18,
    minHeight: 120,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 14,
  },

  // Upload Resume
  uploadSection: {
    marginHorizontal: 20,
    marginBottom: 16,
  },

  uploadBox: {
    backgroundColor: "#F8F7FF",
    borderWidth: 1.5,
    borderColor: "#CFCBFF",
    borderStyle: "dashed",
    borderRadius: 22,
    paddingVertical: 26,
    paddingHorizontal: 18,
    alignItems: "center",
  },

  uploadIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: "#EEF0FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  uploadIcon: {
    fontSize: 34,
    color: "#5B5FEF",
  },

  uploadTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#172033",
    textAlign: "center",
  },

  uploadText: {
    fontSize: 14,
    color: "#5F6678",
    textAlign: "center",
    lineHeight: 21,
    marginTop: 10,
  },

  fileTypes: {
    fontSize: 12,
    fontWeight: "700",
    color: "#7A8194",
    marginTop: 10,
    marginBottom: 18,
    letterSpacing: 0.4,
  },

  browseButton: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    backgroundColor: "#5B5FEF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5B5FEF",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 5,
  },

  browseButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.6,
  },

  // Selected Resumes
  selectedResumesCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
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

  // Analyze Button
  analyzeButton: {
    marginHorizontal: 20,
    marginTop: 6,
    marginBottom: 14,
    height: 54,
    borderRadius: 14,
    backgroundColor: "#5B5FEF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5B5FEF",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },

  analyzeButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.7,
  },

  supportedFormatsTitle: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "700",
    color: "#3E4658",
    marginTop: 8,
  },

  supportedFormatsText: {
    textAlign: "center",
    fontSize: 12,
    color: "#7A8194",
    lineHeight: 18,
    marginTop: 6,
  },
});

export default RecruiterHomeTab;
