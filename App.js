import React, { useEffect, useState } from 'react';
import { Text, View, Image, Alert, StyleSheet, ActivityIndicator, FlatList } from 'react-native';

const Poke = () => {
    const [pokemonList, setPokemonList] = useState([]);
    const [load, setLoad] = useState(false);

    useEffect(() => {
        const offset = 1000; 
        const limit = 10; 
        fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`)
            .then((res) => res.json())
            .then(async (data) => {
                const formattedPokemonList = await Promise.all(data.results.map(async pokemon => {
                    const response = await fetch(pokemon.url);
                    const pokemonData = await response.json();

                    return {
                        name: pokemonData.name,
                        imageUrl: pokemonData.sprites.front_default,
                        stats: pokemonData.stats.map(stat => ({
                            name: stat.stat.name,
                            value: stat.base_stat
                        })),
                        types: pokemonData.types.map(type => type.type.name)
                    };
                }));
                setPokemonList(formattedPokemonList);
                setLoad(true);
            })
            .catch((err) => Alert.alert('Ocurrió un error: ' + err));
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Pokédex</Text>
            </View>
            {load ? (
                <View style={styles.content}>
                    <FlatList
                        data={pokemonList}
                        renderItem={({ item }) => (
                            <View style={styles.pokemonContainer}>
                                <Image
                                    source={{ uri: item.imageUrl }}
                                    style={styles.pokemonImage}
                                />
                                <View style={styles.pokemonDetails}>
                                    <Text style={styles.pokemonName}>Nombre: {item.name}</Text>
                                    <Text style={styles.pokemonStats}>Estadísticas:</Text>
                                    {item.stats.map(stat => (
                                        <Text key={stat.name} style={styles.pokemonStat}>
                                            {stat.name}: {stat.value}
                                        </Text>
                                    ))}
                                    <Text style={styles.pokemonType}>Tipo: {item.types.join(', ')}</Text>
                                </View>
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            ) : (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={styles.loadingText}>Cargando datos...</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#FF0000',
        paddingVertical: 20,
        alignItems: 'center',
    },
    headerText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    pokemonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    pokemonImage: {
        width: 100,
        height: 100,
    },
    pokemonDetails: {
        marginLeft: 20,
    },
    pokemonName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    pokemonStats: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    pokemonStat: {
        fontSize: 16,
        marginBottom: 5,
    },
    pokemonType: {
        fontSize: 16,
        marginBottom: 10,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
    },
});

export default Poke;
