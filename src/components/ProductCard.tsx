import React, { useState, useRef, useEffect } from 'react';
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
  images?: string[];
  imageResizeMode?: string;
}

interface ProductCardProps {
  product: Product;
  imageSource: any;
  onAddToCart: (product: Product) => void;
  onPress?: (product: Product) => void;
}

export default function ProductCard({ product, imageSource, onAddToCart, onPress }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const pressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (pressTimeoutRef.current) clearTimeout(pressTimeoutRef.current);
      if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    };
  }, []);

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    // Mantener el resplandor rojo un momento en móvil para que el usuario aprecie el efecto
    pressTimeoutRef.current = setTimeout(() => {
      setIsPressed(false);
    }, 160);
  };

  const handlePress = () => {
    if (onPress) {
      // En dispositivos táctiles damos un breve instante para apreciar el fondo rojo antes de navegar
      if (Platform.OS !== 'web') {
        navTimeoutRef.current = setTimeout(() => {
          onPress(product);
        }, 110);
      } else {
        onPress(product);
      }
    }
  };

  const isContain = product.imageResizeMode === 'contain' || product.id === '10';

  return (
    <Pressable
      style={({ pressed }) => {
        const isHighlighted = isHovered || isPressed || pressed;
        return [
          styles.card,
          isHighlighted && styles.cardHovered,
          (isPressed || pressed) && styles.cardPressed,
        ];
      }}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      android_ripple={{ color: 'rgba(235, 45, 45, 0.22)', borderless: false }}
    >
      {({ pressed }) => {
        const isHighlighted = isHovered || isPressed || pressed;
        return (
          <>
            <View style={[styles.imageContainer, isHighlighted && styles.imageContainerHovered]}>
              <View style={[styles.imageWrapper, isContain && styles.imageWrapperContain]}>
                <Image
                  source={imageSource}
                  style={[styles.image, isContain && styles.imageContain]}
                  resizeMode={isContain ? 'contain' : 'cover'}
                />
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
          </>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    maxWidth: '50%',
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
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? ({
          transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease, background-color 0.22s ease',
          cursor: 'pointer',
        } as any)
      : {}),
  },
  cardHovered: {
    transform: [{ translateY: -4 }],
    borderColor: 'rgba(235, 45, 45, 0.65)',
    backgroundColor: '#221212',
    shadowColor: '#e50914',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 8,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '0 8px 24px -2px rgba(220, 20, 20, 0.42), 0 0 16px rgba(220, 20, 20, 0.25)',
        } as any)
      : {}),
  },
  cardPressed: {
    transform: [{ translateY: -2 }],
    backgroundColor: '#241212',
    borderColor: 'rgba(235, 45, 45, 0.75)',
    opacity: 0.96,
    elevation: 8,
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
    backgroundColor: '#1b0d0d',
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
  imageWrapperContain: {
    backgroundColor: '#ffffff',
    padding: 6,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageContain: {
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
