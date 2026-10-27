import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Pressable, Platform } from 'react-native';

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
  onPress?: (product: Product) => void;
}

export default function ProductCard({ product, imageSource, onAddToCart, onPress }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        isHovered && styles.cardHovered,
        pressed && styles.cardPressed,
      ]}
      onPress={() => onPress && onPress(product)}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
    >
      <View style={[styles.imageContainer, isHovered && styles.imageContainerHovered]}>
        <View style={styles.imageWrapper}>
          <Image source={imageSource} style={styles.image} resizeMode="cover" />
        </View>
      </View>
      
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    margin: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    ...(Platform.OS === 'web'
      ? ({
          transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease, background-color 0.22s ease',
          cursor: 'pointer',
        } as any)
      : {}),
  },
  cardHovered: {
    transform: [{ translateY: -5 }],
    borderColor: 'rgba(235, 45, 45, 0.55)',
    backgroundColor: '#1e1414',
    shadowColor: '#e50914',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 8,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '0 10px 26px -2px rgba(220, 20, 20, 0.38), 0 0 16px rgba(220, 20, 20, 0.2)',
        } as any)
      : {}),
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ translateY: -2 }],
  },
  imageContainer: {
    width: '100%',
    height: 160,
    backgroundColor: '#141414',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    ...(Platform.OS === 'web'
      ? ({
          transition: 'background-color 0.22s ease',
        } as any)
      : {}),
  },
  imageContainerHovered: {
    backgroundColor: '#180e0e',
  },
  imageWrapper: {
    height: '100%',
    aspectRatio: 765 / 1024,
    backgroundColor: '#f2f2f2',
    borderRadius: 6,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
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