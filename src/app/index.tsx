import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Pressable,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import productosData from '../data/productos.json';
import { localImages } from '../data/imageMap';
import ProductCard, { Product } from '../components/ProductCard';
import { useCart } from '../context/CartContext';

const ITEMS_PER_PAGE = 4;

interface PaginationArrowButtonProps {
  direction: 'left' | 'right';
  disabled: boolean;
  onPress: () => void;
  accessibilityLabel: string;
}

function PaginationArrowButton({
  direction,
  disabled,
  onPress,
  accessibilityLabel,
}: PaginationArrowButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onHoverIn={() => !disabled && setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPressIn={() => !disabled && setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={({ pressed }) => [
        styles.arrowButton,
        disabled && styles.arrowButtonDisabled,
        !disabled && isHovered && styles.arrowButtonHovered,
        !disabled && (isPressed || pressed) && styles.arrowButtonPressed,
      ]}
      accessibilityLabel={accessibilityLabel}
    >
      <Ionicons
        name={direction === 'left' ? 'chevron-back' : 'chevron-forward'}
        size={18}
        color={disabled ? '#444' : isHovered || isPressed ? '#fff' : '#ddd'}
      />
    </Pressable>
  );
}

export default function Index() {
  const router = useRouter();
  const { addToCart, totalCount } = useCart();
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const flatListRef = useRef<FlatList>(null);

  const filteredProducts = productosData.filter((product) => {
    const query = searchText.toLowerCase();
    return (
      product.nombre.toLowerCase().includes(query) ||
      product.descripcion.toLowerCase().includes(query) ||
      product.marca.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages);

  const paginatedProducts = filteredProducts.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    setCurrentPage(1);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
  };

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
          onChangeText={handleSearchChange}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => handleSearchChange('')}>
            <Ionicons name="close-circle" size={18} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Colección Collaborations</Text>
        {filteredProducts.length > 0 && (
          <Text style={styles.productCountBadge}>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'prenda' : 'prendas'}
          </Text>
        )}
      </View>

      <FlatList
        ref={flatListRef}
        style={styles.flatList}
        data={paginatedProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={[
          styles.listContainer,
          paginatedProducts.length === 0 && styles.listContainerEmpty,
        ]}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            imageSource={localImages[item.imageKey]}
            onAddToCart={addToCart}
            onPress={(prod: Product) => router.push(`/product/${prod.id}` as any)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={40} color="#444" style={{ marginBottom: 10 }} />
            <Text style={styles.emptyTitle}>Sin resultados</Text>
            <Text style={styles.emptySubtitle}>No hemos encontrado prendas que coincidan con la búsqueda</Text>
          </View>
        }
      />

      {filteredProducts.length > 0 && (
        <View style={styles.paginationBar}>
          <PaginationArrowButton
            direction="left"
            disabled={activePage <= 1}
            onPress={() => handlePageChange(activePage - 1)}
            accessibilityLabel="Página anterior"
          />

          <View style={styles.pageIndicatorContainer}>
            <Text style={styles.pageIndicatorText}>
              Página <Text style={styles.pageNumber}>{activePage}</Text> de{' '}
              <Text style={styles.pageTotal}>{totalPages}</Text>
            </Text>
          </View>

          <PaginationArrowButton
            direction="right"
            disabled={activePage >= totalPages}
            onPress={() => handlePageChange(activePage + 1)}
            accessibilityLabel="Página siguiente"
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  flatList: { flex: 1 },
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
  searchInput: {
    flex: 1,
    height: 40,
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Montserrat_400Regular',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: 14,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Montserrat_700Bold',
    color: '#fff',
  },
  productCountBadge: {
    fontSize: 12,
    fontFamily: 'Montserrat_500Medium',
    color: '#888',
  },
  listContainer: {
    paddingHorizontal: 6,
    paddingBottom: 16,
  },
  listContainerEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 15,
    color: '#fff',
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#777',
    fontFamily: 'Montserrat_400Regular',
    textAlign: 'center',
  },
  paginationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0c0c0c',
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1c1c1c',
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web'
      ? ({
          transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease, background-color 0.22s ease',
          cursor: 'pointer',
        } as any)
      : {}),
  },
  arrowButtonHovered: {
    transform: [{ scale: 1.08 }],
    borderColor: 'rgba(235, 45, 45, 0.75)',
    backgroundColor: '#241212',
    shadowColor: '#e50914',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.65,
    shadowRadius: 12,
    elevation: 8,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '0 0 14px 2px rgba(235, 45, 45, 0.6), 0 0 24px 4px rgba(220, 20, 20, 0.3)',
        } as any)
      : {}),
  },
  arrowButtonPressed: {
    transform: [{ scale: 0.95 }],
    backgroundColor: '#2b1010',
    borderColor: 'rgba(235, 45, 45, 0.9)',
    shadowColor: '#e50914',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 6,
  },
  arrowButtonDisabled: {
    backgroundColor: '#131313',
    borderColor: '#202020',
    opacity: 0.35,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'not-allowed',
        } as any)
      : {}),
  },
  pageIndicatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageIndicatorText: {
    fontSize: 13,
    color: '#888',
    fontFamily: 'Montserrat_500Medium',
  },
  pageNumber: {
    color: '#fff',
    fontFamily: 'Montserrat_700Bold',
  },
  pageTotal: {
    color: '#bbb',
    fontFamily: 'Montserrat_600SemiBold',
  },
});
