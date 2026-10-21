import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import productosData from '../data/productos.json';
import { localImages } from '../data/imageMap';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

export default function Index() {
  const router = useRouter();
  const { addToCart, totalCount } = useCart();
  const [searchText, setSearchText] = useState('');

  const filteredProducts = productosData.filter((product) => {
    const query = searchText.toLowerCase();
    return (
      product.nombre.toLowerCase().includes(query) ||
      product.descripcion.toLowerCase().includes(query) ||
      product.marca.toLowerCase().includes(query)
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Image
          source={require('../../assets/abyssLogo.png')}
          style={styles.brandLogo}
          resizeMode="contain"
          accessibilityLabel="ABYSS"
        />
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => router.push('/cart')}
          activeOpacity={0.8}
        >
          <Ionicons name="cart-outline" size={20} color="#000" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartText}>{totalCount}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color="#666" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por marca, prenda..."
          placeholderTextColor="#666"
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={18} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.sectionTitle}>Colección Collaborations</Text>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            imageSource={localImages[item.imageKey]}
            onAddToCart={addToCart}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  brandLogo: {
    width: 95,
    height: 52,
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  cartBadge: {
    backgroundColor: '#000',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  cartText: { fontFamily: 'Montserrat_700Bold', color: '#fff', fontSize: 12 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  searchInput: { flex: 1, height: 40, color: '#fff', fontSize: 13, fontFamily: 'Montserrat_400Regular' },
  clearText: { color: '#888', fontSize: 14, fontFamily: 'Montserrat_700Bold' },
  sectionTitle: { fontSize: 15, fontFamily: 'Montserrat_700Bold', color: '#fff', margin: 12 },
  listContainer: { paddingHorizontal: 6, paddingBottom: 20 },
});