import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';

export interface Product {
  id: string;
  nombre: string;
  marca: string;
  categoria: string;
  precio: number;
  descripcion: string;
  imageKey: string;
}

interface ProductCardProps {
  product: Product;
  imageSource: any;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, imageSource, onAddToCart }: ProductCardProps) {
  return (
    <View style={styles.card}>
      <Image source={imageSource} style={styles.image} />
      
      <View style={styles.infoContainer}>
        <Text style={styles.brand}>{product.marca.toUpperCase()}</Text>
        <Text style={styles.name} numberOfLines={1}>{product.nombre}</Text>
        <Text style={styles.price}>{product.precio.toFixed(2)} €</Text>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => onAddToCart(product)}
          activeOpacity={0.8}
        >
          <Ionicons name="cart-outline" size={15} color="#000" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Añadir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    margin: 6,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 10,
  },
  brand: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 10,
    color: '#888',
    letterSpacing: 1,
    marginBottom: 2,
  },
  name: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 13,
    color: '#fff',
    marginBottom: 4,
  },
  price: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: '#fff',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 6,
  },
  buttonText: {
    fontFamily: 'Montserrat_700Bold',
    color: '#000',
    fontSize: 11,
  },
});