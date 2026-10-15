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
} from 'react-native';

// 1. Importación de datos, mapa de imágenes y tarjeta
import productosData from '../data/productos.json';
import { localImages } from '../data/imageMap';
import ProductCard from '../components/ProductCard';

// 2. EXPORT DEFAULT OBLIGATORIO para que Expo Router lea la pantalla
export default function Index() {
  const [cart, setCart] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');

  const addToCart = (product: any) => {
    setCart([...cart, product]);
  };

  // Buscador por nombre, descripción o marca (Requisito PDF)
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

      {/* Cabecera de ABYSS */}
      <View style={styles.header}>
        <Text style={styles.brandTitle}>ABYSS</Text>
        <View style={styles.cartBadge}>
          <Text style={styles.cartText}>🛒 {cart.length}</Text>
        </View>
      </View>

      {/* Buscador */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por marca, prenda..."
          placeholderTextColor="#666"
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.sectionTitle}>Colección Collaborations</Text>

      {/* Catálogo usando ProductCard */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <ProductCard
            product={{ ...item, precio: parseFloat(item.precio) }}
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
    padding: 15,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  brandTitle: { fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 3 },
  cartBadge: { backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  cartText: { color: '#000', fontWeight: 'bold' },
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
  searchInput: { flex: 1, height: 40, color: '#fff', fontSize: 13 },
  clearText: { color: '#888', fontSize: 14, fontWeight: 'bold' },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#fff', margin: 12 },
  listContainer: { paddingHorizontal: 6, paddingBottom: 20 },
});