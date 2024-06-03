import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

type SignInScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignIn'>;

interface SignInProps {
  navigation: SignInScreenNavigationProp;
}

const SignInScreen: React.FC<SignInProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSignIn = () => {
    if (email && password) {
      navigation.navigate('SignUp'); 
    } else {
      alert('Veuillez remplir tous les champs.');
    }
  };
  return (
    <View style={styles.container}>
      <Image source={require('../assets/TM.png')} style={styles.logo} />
      <TextInput
        style={styles.input}
        placeholder="Adresse mail"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Connexion</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.linkText}>Vous n'avez pas de compte ? Inscrivez-vous</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 50,
    marginBottom: 20,
  },
  input: {
    width: '90%',
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  button: {
    backgroundColor: 'black',
    width: '90%',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    marginTop: 20,
    color: 'blue',
    fontSize: 16,
  },
});

export default SignInScreen;
