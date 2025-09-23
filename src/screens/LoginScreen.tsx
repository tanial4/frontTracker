import React, { useMemo, useState } from "react";
import {
  SafeAreaView, KeyboardAvoidingView, Platform,
  View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, StyleSheet
} from "react-native";
import { Eye, EyeOff, Flame } from "lucide-react-native";

const MIN_PASSWORD = 6;
const isEmail = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToSignup: () => void;
}

export function LoginScreen({ onLogin, onSwitchToSignup }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState<{email:boolean; password:boolean}>({email:false, password:false});

  const emailError = useMemo(() => {
    if (!touched.email) return "";
    if (!email.trim()) return "El correo es obligatorio";
    if (!isEmail(email)) return "Ingresa un correo válido";
    return "";
  }, [email, touched.email]);

  const passwordError = useMemo(() => {
    if (!touched.password) return "";
    if (!password) return "La contraseña es obligatoria";
    if (password.length < MIN_PASSWORD) return `Mínimo ${MIN_PASSWORD} caracteres`;
    return "";
  }, [password, touched.password]);

  const canSubmit =
    isEmail(email) && password.length >= MIN_PASSWORD && !isLoading;

  const handleSubmit = () => {
    setTouched({email:true, password:true});
    if (!canSubmit) return;
    setIsLoading(true);
    setTimeout(() => {
      onLogin(email.trim(), password);
      setIsLoading(false);
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.logoBox}><Flame size={32} color="#fff" /></View>
            <Text style={styles.title}>¡Bienvenido de vuelta!</Text>
            <Text style={styles.subtitle}>Continúa con tus rachas junto a tus amigos</Text>
          </View>

          <View style={styles.card}>
            {/* Email */}
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={(v)=>{ setEmail(v); if(!touched.email) setTouched(t=>({...t,email:true})); }}
              onBlur={()=>setTouched(t=>({...t,email:true}))}
              placeholder="tu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              returnKeyType="next"
            />
            {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}

            {/* Password */}
            <Text style={[styles.label,{marginTop:10}]}>Contraseña</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                value={password}
                onChangeText={(v)=>{ setPassword(v); if(!touched.password) setTouched(t=>({...t,password:true})); }}
                onBlur={()=>setTouched(t=>({...t,password:true}))}
                placeholder={`Mínimo ${MIN_PASSWORD} caracteres`}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                style={[styles.input, styles.inputWithIcon]}
                returnKeyType="done"
              />
              <TouchableOpacity onPress={() => setShowPassword(s=>!s)} style={styles.eyeBtn} activeOpacity={0.7}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </TouchableOpacity>
            </View>
            {!!passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

            {/* Submit */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!canSubmit}
              style={[styles.primaryBtn, !canSubmit && styles.btnDisabled]}
              activeOpacity={0.8}
            >
              {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Iniciar Sesión</Text>}
            </TouchableOpacity>

            {/* Enlace a registro */}
            <View style={styles.centerRow}>
              <Text style={styles.helperText}>¿No tienes cuenta? </Text>
              <TouchableOpacity onPress={onSwitchToSignup}>
                <Text style={styles.linkPrimary}>Crear cuenta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:"#0b0b0c"},
  container:{flex:1,padding:16,justifyContent:"center"},
  header:{alignItems:"center",marginBottom:24},
  logoBox:{width:64,height:64,borderRadius:16,backgroundColor:"#6f5cff",alignItems:"center",justifyContent:"center",marginBottom:12},
  title:{fontSize:22,fontWeight:"700",color:"#fff"},
  subtitle:{color:"#9ca3af",marginTop:4,textAlign:"center"},
  card:{backgroundColor:"#131316",borderRadius:16,padding:16},
  label:{color:"#e5e7eb",fontSize:14},
  input:{borderWidth:1,borderColor:"#26272b",backgroundColor:"#0e0f12",borderRadius:10,paddingHorizontal:12,paddingVertical:10,color:"#fff"},
  passwordWrapper:{position:"relative"},
  inputWithIcon:{paddingRight:40},
  eyeBtn:{position:"absolute",right:8,top:0,bottom:0,width:32,alignItems:"center",justifyContent:"center"},
  errorText:{color:"#ef4444",fontSize:12,marginTop:6},
  primaryBtn:{backgroundColor:"#6f5cff",borderRadius:10,paddingVertical:12,alignItems:"center",marginTop:16},
  primaryBtnText:{color:"#fff",fontWeight:"600"},
  btnDisabled:{opacity:0.5},
  centerRow:{flexDirection:"row",justifyContent:"center",marginTop:16,alignItems:"center"},
  helperText:{color:"#9ca3af",fontSize:13},
  linkPrimary:{color:"#6f5cff",fontSize:13,fontWeight:"600"},
});
