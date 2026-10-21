import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCart } from '../context/CartContext';
import { localImages } from '../data/imageMap';

export default function CartScreen() {
  const router = useRouter();
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice, totalCount } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const handleCheckout = () => {
    if (items.length === 0) return;
    setOrderPlaced(true);
    clearCart();
  };

  const handleClearConfirm = () => {
    if (items.length === 0) return;
    setShowClearModal(true);
  };

  const confirmDeleteProduct = () => {
    if (productToDelete) {
      removeFromCart(productToDelete);
      setProductToDelete(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>MI CARRITO</Text>

        {items.length > 0 ? (
          <TouchableOpacity onPress={handleClearConfirm} style={styles.clearCartBtn}>
            <Ionicons name="trash-outline" size={20} color="#ff5252" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}
      </View>

      {orderPlaced ? (
        <View style={styles.successContainer}>
          <View style={styles.successIconCircle}>
            <Ionicons name="checkmark-circle" size={80} color="#4cd964" />
          </View>
          <Text style={styles.successTitle}>¡Tu pedido ha sido realizado!</Text>
          <Text style={styles.successSubtitle}>
            Gracias por tu compra en ABYSS. Recibirás los detalles de tu envío en breve.
          </Text>
          <TouchableOpacity
            style={styles.returnButton}
            onPress={() => {
              setOrderPlaced(false);
              router.replace('/');
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.returnButtonText}>VOLVER AL CATÁLOGO</Text>
          </TouchableOpacity>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={70} color="#444" />
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
          <Text style={styles.emptySubtitle}>
            Explora nuestra colección y añade prendas a tu cesta.
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.exploreButtonText}>DESCUBRIR PRENDAS</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={items}
            keyExtractor={(item) => item.product.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const imageSrc = localImages[item.product.imageKey];
              return (
                <View style={styles.itemCard}>
                  {imageSrc && (
                    <Image source={imageSrc} style={styles.itemImage} resizeMode="cover" />
                  )}

                  <View style={styles.itemDetails}>
                    <View style={styles.itemHeaderRow}>
                      <Text style={styles.itemBrand}>{item.product.marca.toUpperCase()}</Text>
                      <TouchableOpacity
                        onPress={() => setProductToDelete(item.product.id)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Ionicons name="close-circle-outline" size={20} color="#888" />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.itemName} numberOfLines={1}>
                      {item.product.nombre}
                    </Text>

                    <Text style={styles.itemPrice}>
                      {(item.product.precio * item.quantity).toFixed(2)} €
                    </Text>

                    <View style={styles.quantityContainer}>
                      <TouchableOpacity
                        style={styles.qtyButton}
                        onPress={() => updateQuantity(item.product.id, -1)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="remove" size={16} color="#fff" />
                      </TouchableOpacity>

                      <Text style={styles.qtyText}>{item.quantity}</Text>

                      <TouchableOpacity
                        style={styles.qtyButton}
                        onPress={() => updateQuantity(item.product.id, 1)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="add" size={16} color="#fff" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => setProductToDelete(item.product.id)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="trash-outline" size={16} color="#ff5252" />
                        <Text style={styles.deleteText}>Eliminar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            }}
          />

          <View style={styles.footer}>
            <View style={styles.footerRow}>
              <Text style={styles.footerLabel}>Productos ({totalCount})</Text>
              <Text style={styles.footerValue}>{totalPrice.toFixed(2)} €</Text>
            </View>
            <View style={styles.footerRow}>
              <Text style={styles.footerLabel}>Envío</Text>
              <Text style={styles.freeShipping}>GRATIS</Text>
            </View>
            <View style={[styles.footerRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>TOTAL</Text>
              <Text style={styles.totalValue}>{totalPrice.toFixed(2)} €</Text>
            </View>

            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={styles.clearAllButton}
                onPress={handleClearConfirm}
                activeOpacity={0.8}
              >
                <Ionicons name="trash-outline" size={18} color="#ff5252" />
                <Text style={styles.clearAllButtonText}>Vaciar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={handleCheckout}
                activeOpacity={0.8}
              >
                <Ionicons name="bag-check-outline" size={20} color="#000" style={{ marginRight: 6 }} />
                <Text style={styles.checkoutButtonText}>REALIZAR PEDIDO</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Modal: vaciar carrito */}
      <Modal
        transparent
        animationType="fade"
        visible={showClearModal}
        onRequestClose={() => setShowClearModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Ionicons name="trash-outline" size={36} color="#ff5252" style={{ marginBottom: 12 }} />
            <Text style={styles.modalTitle}>Vaciar carrito</Text>
            <Text style={styles.modalMessage}>
              ¿Estás seguro de que quieres eliminar todos los productos del carrito?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowClearModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={() => { clearCart(); setShowClearModal(false); }}
                activeOpacity={0.8}
              >
                <Text style={styles.modalConfirmText}>Vaciar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal: eliminar producto */}
      <Modal
        transparent
        animationType="fade"
        visible={productToDelete !== null}
        onRequestClose={() => setProductToDelete(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Ionicons name="close-circle-outline" size={36} color="#ff5252" style={{ marginBottom: 12 }} />
            <Text style={styles.modalTitle}>Eliminar producto</Text>
            <Text style={styles.modalMessage}>
              ¿Estás seguro de que quieres eliminar este producto del carrito?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setProductToDelete(null)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={confirmDeleteProduct}
                activeOpacity={0.8}
              >
                <Text style={styles.modalConfirmText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  backButton: { padding: 4 },
  headerTitle: {
    fontFamily: 'Montserrat_700Bold',
    color: '#fff',
    fontSize: 16,
    letterSpacing: 1.5,
  },
  clearCartBtn: { padding: 4 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontFamily: 'Montserrat_700Bold',
    color: '#fff',
    fontSize: 18,
    marginTop: 16,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontFamily: 'Montserrat_400Regular',
    color: '#888',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  exploreButtonText: {
    fontFamily: 'Montserrat_700Bold',
    color: '#000',
    fontSize: 12,
    letterSpacing: 1,
  },
  listContent: { padding: 14 },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#262626',
  },
  itemImage: {
    width: 80,
    height: 95,
    borderRadius: 6,
    backgroundColor: '#222',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemBrand: {
    fontFamily: 'Montserrat_700Bold',
    color: '#888',
    fontSize: 10,
    letterSpacing: 1,
  },
  itemName: {
    fontFamily: 'Montserrat_600SemiBold',
    color: '#fff',
    fontSize: 14,
    marginTop: 2,
  },
  itemPrice: {
    fontFamily: 'Montserrat_700Bold',
    color: '#fff',
    fontSize: 15,
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  qtyButton: {
    backgroundColor: '#2b2b2b',
    width: 28,
    height: 28,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontFamily: 'Montserrat_700Bold',
    color: '#fff',
    fontSize: 14,
    marginHorizontal: 12,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#251515',
  },
  deleteText: {
    fontFamily: 'Montserrat_600SemiBold',
    color: '#ff5252',
    fontSize: 11,
    marginLeft: 4,
  },
  footer: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  footerLabel: {
    fontFamily: 'Montserrat_500Medium',
    color: '#888',
    fontSize: 13,
  },
  footerValue: {
    fontFamily: 'Montserrat_600SemiBold',
    color: '#fff',
    fontSize: 13,
  },
  freeShipping: {
    fontFamily: 'Montserrat_700Bold',
    color: '#4cd964',
    fontSize: 12,
  },
  totalRow: {
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#222',
    marginBottom: 16,
  },
  totalLabel: {
    fontFamily: 'Montserrat_700Bold',
    color: '#fff',
    fontSize: 15,
    letterSpacing: 1,
  },
  totalValue: {
    fontFamily: 'Montserrat_700Bold',
    color: '#fff',
    fontSize: 18,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#241414',
    borderWidth: 1,
    borderColor: '#4d1e1e',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 6,
    gap: 6,
  },
  clearAllButtonText: {
    fontFamily: 'Montserrat_700Bold',
    color: '#ff5252',
    fontSize: 12,
  },
  checkoutButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 6,
  },
  checkoutButtonText: {
    fontFamily: 'Montserrat_700Bold',
    color: '#000',
    fontSize: 13,
    letterSpacing: 1,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  successIconCircle: { marginBottom: 18 },
  successTitle: {
    fontFamily: 'Montserrat_700Bold',
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  successSubtitle: {
    fontFamily: 'Montserrat_400Regular',
    color: '#888',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  returnButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 6,
  },
  returnButtonText: {
    fontFamily: 'Montserrat_700Bold',
    color: '#000',
    fontSize: 13,
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  modalBox: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2e2e2e',
  },
  modalTitle: {
    fontFamily: 'Montserrat_700Bold',
    color: '#fff',
    fontSize: 17,
    marginBottom: 8,
  },
  modalMessage: {
    fontFamily: 'Montserrat_400Regular',
    color: '#aaa',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: '#2b2b2b',
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  modalCancelText: {
    fontFamily: 'Montserrat_600SemiBold',
    color: '#ccc',
    fontSize: 13,
  },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: '#3a1010',
    borderWidth: 1,
    borderColor: '#6b1f1f',
  },
  modalConfirmText: {
    fontFamily: 'Montserrat_700Bold',
    color: '#ff5252',
    fontSize: 13,
  },
});
