import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';


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
          <Text style={styles.buttonText}>Añadir al carrito</Text>
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
    fontSize: 10,
    color: '#888',
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 2,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 11,
    fontWeight: 'bold',
  },
});