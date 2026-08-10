import * as DocumentPicker from "expo-document-picker";

const pickResume = async () => {
    try {
        const result = await DocumentPicker.getDocumentAsync({
            type: [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ],
            copyToCacheDirectory: true,
        });

        if (result.canceled) {
            return null;
        }

        return result.assets[0];

    } catch (error) {
        throw error;
    }
};

export const pickMultipleResumes = async (pdfOnly = false) => {
    const result = await DocumentPicker.getDocumentAsync({
        type: pdfOnly
            ? 'application/pdf'
            : [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ],
        copyToCacheDirectory: true,
        multiple: true,
    });

    return result.canceled ? [] : result.assets;
};

export default pickResume
