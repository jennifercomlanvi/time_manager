import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const TimerScreen = () => {
  const [time, setTime] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [projects, setProjects] = useState<Array<{ id: number; name: string }>>([
    { id: 1, name: 'Donnons' },
    { id: 2, name: 'Agenda' }
  ]);
  const [tasks, setTasks] = useState<Array<{ id: number; name: string; projectId: number }>>([
    { id: 1, name: 'Ajout don', projectId: 1 },
    { id: 2, name: 'Ajout organisateur', projectId: 2 }
  ]);
  const [selectedProject, setSelectedProject] = useState<number>(projects[0].id);
  const [selectedTask, setSelectedTask] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    } else {
      interval && clearInterval(interval);
    }
    return () => {
      interval && clearInterval(interval);
    };
  }, [isActive, time]);

  const handleStart = () => setIsActive(true);
  const handleStop = () => setIsActive(false);
  const handleReset = () => {
    setIsActive(false);
    setTime(0);
  };

  // Formatter la date en format français
  const formattedDate = new Date().toLocaleDateString('fr-FR');

  return (
    <View style={styles.container}>
      <Image source={require('../assets/TM.png')} style={styles.logo} />
      <Text style={styles.title}>Minuteur</Text>
      <Text>Date du jour: {formattedDate}</Text>
      <Text>Temps écoulé: {time} secondes</Text>
      <View style={styles.buttonContainer}>
        <Button title="Démarrer" onPress={handleStart} color="#32CD32"/>
        <Button title="Arrêter" onPress={handleStop} color="#FF6347"/>
        <Button title="Réinitialiser" onPress={handleReset} color="#4682B4"/>
      </View>
      <Picker
        selectedValue={selectedProject}
        onValueChange={(itemValue) => setSelectedProject(itemValue)}
        style={styles.picker}>
        {projects.map((project) => (
          <Picker.Item key={project.id} label={project.name} value={project.id} />
        ))}
      </Picker>
      <Picker
        selectedValue={selectedTask}
        onValueChange={(itemValue) => setSelectedTask(itemValue)}
        style={styles.picker}>
        {tasks.filter(task => task.projectId === selectedProject).map((task) => (
          <Picker.Item key={task.id} label={task.name} value={task.id} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  logo: {
    width: 150, // Réglez la taille selon vos besoins
    height: 100,
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  picker: {
    width: '100%',
    height: 50,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
  }
});

export default TimerScreen;
