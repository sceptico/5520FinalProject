import React, { useState } from "react";
import { View, Text, Modal, Pressable, StyleSheet, FlatList, TouchableOpacity } from "react-native";

const FilterSortBar = ({ filters, sortOptions, onFilterChange, onSortChange }) => {
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedSort, setSelectedSort] = useState("");

  const handleFilterDone = () => {
    onFilterChange(selectedFilter);
    setFilterModalVisible(false);
  };

  const handleSortDone = () => {
    onSortChange(selectedSort);
    setSortModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Filter Button */}
      <Pressable style={styles.button} onPress={() => setFilterModalVisible(true)}>
        <Text style={styles.buttonText}>Filter</Text>
      </Pressable>

      {/* Sort Button */}
      <Pressable style={styles.button} onPress={() => setSortModalVisible(true)}>
        <Text style={styles.buttonText}>Sort</Text>
      </Pressable>

      {/* Filter Modal */}
      <Modal visible={filterModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Filter</Text>
            <FlatList
              data={filters}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    selectedFilter === item.value && styles.selectedItem,
                  ]}
                  onPress={() => setSelectedFilter(item.value)}
                >
                  <Text>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <Pressable style={styles.doneButton} onPress={handleFilterDone}>
              <Text style={styles.doneButtonText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Sort Modal */}
      <Modal visible={sortModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Sort Option</Text>
            <FlatList
              data={sortOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    selectedSort === item.value && styles.selectedItem,
                  ]}
                  onPress={() => setSelectedSort(item.value)}
                >
                  <Text>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <Pressable style={styles.doneButton} onPress={handleSortDone}>
              <Text style={styles.doneButtonText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end", // Position at the bottom
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Add overlay effect
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: "50%", // Set the height to half of the screen
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  modalItem: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    marginVertical: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  selectedItem: {
    backgroundColor: "#007bff",
    color: "#fff",
  },
  doneButton: {
    marginTop: 20,
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  doneButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default FilterSortBar;
