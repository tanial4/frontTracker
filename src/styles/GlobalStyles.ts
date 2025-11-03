import { StyleSheet } from 'react-native';
import { BRAND_COLORS as COLORS } from './Colors'; 


export const globalLayout = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.WHITE },
    keyboardAvoidingView: { flex: 1 },
    scrollViewContent: {
        flexGrow: 1, 
        alignItems: 'center',
        paddingHorizontal: 20, 
        paddingTop: 40,
        paddingBottom: 20,
    },
    
    
    headerContainer: { alignItems: 'center', marginBottom: 30 },
    logoWrapper: {
        width: 60, height: 60, borderRadius: 15,
        backgroundColor: COLORS.BUTTON_PRIMARY_BG, 
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 12,
    },
    title: { fontSize: 20, fontWeight: 'bold', color: COLORS.TEXT_PRIMARY, marginBottom: 3 },
    subtitle: { color: COLORS.TEXT_MUTED, fontSize: 14, textAlign: 'center' },
});

export const formComponentStyles = StyleSheet.create({

    formCardBase: {
        width: '100%', maxWidth: 380, borderWidth: 1, borderColor: COLORS.GRAY_BORDER,
        backgroundColor: COLORS.WHITE, borderRadius: 12, padding: 20,
        shadowColor: COLORS.BLACK, shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1, shadowRadius: 3, elevation: 3,
    },
    inputGroup: { gap: 12, marginBottom: 20 }, 

    label: {
        fontSize: 14,
        color: COLORS.TEXT_PRIMARY,
        marginBottom: 8,
        fontWeight: '500',
    },
    inputContainer: { 
        flexDirection: 'row', alignItems: 'center',
        borderWidth: 1, borderColor: COLORS.GRAY_BORDER,
        backgroundColor: COLORS.INPUT_BG, borderRadius: 8,
        paddingHorizontal: 12,
    },
    input: { 
        flex: 1, height: 48, fontSize: 16,
        color: COLORS.TEXT_PRIMARY,
    },
    inputError: { 
        borderColor: COLORS.ERROR_TEXT, 
    },
    errorText: { 
        color: COLORS.ERROR_TEXT, 
        fontSize: 12, 
        marginTop: 4, 
    },
    passwordToggle: { 
        position: 'absolute', right: 12, padding: 5,
    },

    loginButton: {
        backgroundColor: COLORS.BUTTON_PRIMARY_BG, paddingVertical: 10, borderRadius: 8,
        alignItems: 'center', justifyContent: 'center',
    },
    loginButtonText: {
        color: COLORS.BUTTON_PRIMARY_TEXT, fontSize: 15, fontWeight: '600',
    },
    buttonDisabled: { opacity: 0.5 },

    forgotPasswordButton: { alignSelf: 'flex-end', marginTop: 12 },
    forgotPasswordText: { fontWeight: '500', color: COLORS.primary, fontSize: 13 }, 

    signupContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 16, marginTop: 32 },
    signupText: { fontSize: 14, color: COLORS.TEXT_MUTED },
    signupLink: { fontWeight: 'bold', color: COLORS.primary, fontSize: 14, marginLeft: 4 }, 

    demoCard: {
        marginTop: 30, width: '100%', maxWidth: 380,
        borderRadius: 12, borderWidth: 1,
        borderColor: COLORS.GRAY_BORDER,
        backgroundColor: COLORS.INPUT_BG, 
        padding: 16,
        shadowColor: COLORS.BLACK, shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05, shadowRadius: 2, elevation: 1,
    },
    demoTitle: { color: COLORS.TEXT_PRIMARY, fontWeight: '500', marginBottom: 10, textAlign: 'center' },
    demoButton: {
        backgroundColor: COLORS.WHITE, 
        borderColor: COLORS.GRAY_BORDER,
        borderWidth: 1, paddingVertical: 10, borderRadius: 8,
    },
    demoButtonText: { color: COLORS.TEXT_PRIMARY, fontWeight: '600', fontSize: 15 },
    helpCard: {
        width: '90%',
        maxWidth: 400,
        backgroundColor: COLORS.GRAY_ACCENT, 
        padding: 15,
        borderRadius: 10,
        marginTop: 30,
    },
    helpIconTextWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    helpTextWrapper: {
        marginLeft: 15,
        flexShrink: 1,
    },

    helpTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: COLORS.TEXT_PRIMARY,
        marginBottom: 2,
    },
    helpSubtitle: {
        fontSize: 13,
        color: COLORS.TEXT_MUTED,
    },
});