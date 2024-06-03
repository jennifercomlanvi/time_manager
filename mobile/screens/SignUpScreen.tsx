import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

type SignUpScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignUp'>;

interface SignUpProps {
  navigation: SignUpScreenNavigationProp;
}

const SignUpScreen: React.FC<SignUpProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    if (name && email && password) {
      // Ici, intégrez la logique pour enregistrer les données ou pour naviguer
      console.log('Enregistrement', name, email, password);
      // navigation.navigate('SomeOtherScreen'); // Si nécessaire
    } else {
      alert('Veuillez remplir tous les champs.');
    }
  };

  return (
    <View style={styles.container}>
    <Image source={require('../assets/TM.png')} style={styles.logo} />
      <TextInput
        style={styles.input}
        placeholder="Nom"
        onChangeText={setName}
        value={name}
      />
      <TextInput
        style={styles.input}
        placeholder="Adresse mail"
        keyboardType="email-address"
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
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Enregistrer</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.linkText}>Vous avez déjà un compte ? Connectez-vous</Text>
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
  input: {
    width: '90%',
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  logo: {
    width: 100,
    height: 50,
    marginBottom: 20,
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

export default SignUpScreen;
