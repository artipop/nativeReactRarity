import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import Modal from "react-native-modal";
import { Colors } from "@/shared/constStyle";
import Input from "@/components/Input";
import {
  SearchParamType,
  FilterOption,
  TypeFilter,
} from "../models/search/types";

import { useTranslation } from "react-i18next";

type Props = {
  modalVisible: boolean;
  searchText: string;
  style?: ViewStyle;
  paramsFilter: SearchParamType;
  isLoading: boolean;
  selectedParam: {
    selectedCountries: FilterOption | null;
    selectedManufacturers: FilterOption | null;
    selectedSymbol: FilterOption | null;
  };
  setModalVisible: (param: boolean) => void;
  onChangeSearchText: (param: string) => void;
  onClickParam: (type: TypeFilter, param: string) => void;
};

const ModalSearch = ({
  style,
  modalVisible = false,
  searchText,
  paramsFilter,
  isLoading,
  selectedParam,
  setModalVisible,
  onChangeSearchText,
  onClickParam,
}: Props) => {
  const { t } = useTranslation();
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  // вдруг нада закрывать модальное окно
  // const searchOnBlock = () => {
  //   setModalVisible(false);
  // };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  const variables = [
    {
      label: "Близкие варианты",
      type: TypeFilter.symbol,
      values: paramsFilter.symbols || [],
    },
    {
      label: "Производители",
      type: TypeFilter.manufacturer,
      values: paramsFilter.manufacturers || [],
    },
    {
      label: "Страны",
      type: TypeFilter.country,
      values: paramsFilter.countries || [],
    },
  ];

  // узнать активный ли фильтр
  function isParamActive(param: string) {
    if (param === selectedParam.selectedCountries?.name) {
      return true;
    }

    if (param === selectedParam.selectedManufacturers?.name) {
      return true;
    }

    if (param === selectedParam.selectedSymbol?.name) {
      return true;
    }

    return false;
  }

  return (
    <Modal
      isVisible={modalVisible}
      onSwipeComplete={() => setModalVisible(false)}
      swipeDirection="down"
      onBackdropPress={() => setModalVisible(false)}
      style={[styles.modal, style]}
      propagateSwipe
      scrollTo={(p) => scrollViewRef.current?.scrollTo(p)}
      scrollOffset={scrollOffset}
      scrollOffsetMax={500}
    >
      <View style={styles.modalContent}>
        <View style={styles.modalHeaderIndicator} />

        <Text style={styles.modalTitle}>{t("titleSearch")}</Text>

        <View style={styles.input}>
          <Input
            placeholder={t("titleSearch")}
            value={searchText}
            onChangeText={(param) => onChangeSearchText(param)}
            isSearch
            deleteText={() => onChangeSearchText("")}
            isLoading={isLoading}
          />
        </View>

        <ScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.blocks}>
            {variables.map((variable) => (
              <View style={styles.block} key={variable.label}>
                <Text style={styles.label}>{variable.label}</Text>
                <View style={styles.blockList}>
                  {variable.values.map((valueItem) => (
                    <TouchableOpacity
                      onPress={() => {
                        onClickParam(variable.type, valueItem);
                      }}
                      key={valueItem}
                      // style={}
                    >
                      <Text
                        style={[
                          styles.valueText,
                          isParamActive(valueItem) && styles.activeParam,
                        ]}
                      >
                        {valueItem}
                      </Text>
                    </TouchableOpacity>
                  ))}

                  {variable.values.length === 0 && (
                    <Text style={styles.valueTextNotFind}>Не найдено</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
    width: "100%",
    zIndex: 100,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    height: "90%",
  },
  modalHeaderIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontWeight: 600,
    fontSize: 20,
    marginBottom: 12,
    fontFamily: "Inter_400Regular",
  },
  input: {
    marginBottom: 24,
  },
  blocks: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
  },
  block: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flexWrap: "wrap",
  },
  label: {
    fontWeight: 600,
    fontSize: 18,
    lineHeight: 18,
    marginBottom: 16,
    fontFamily: "Inter_400Regular",
  },
  blockList: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  activeParam: {
    backgroundColor: Colors.Primary2,
    color: Colors.Primary,
  },
  valueText: {
    fontWeight: 500,
    fontSize: 16,
    lineHeight: 16,
    fontFamily: "Inter_400Regular",

    padding: 8,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: Colors.GrayColor3,
    color: Colors.BlackColor,
  },
  valueTextNotFind: {
    fontWeight: 500,
    fontSize: 16,
    lineHeight: 16,
    fontFamily: "Inter_400Regular",
    color: Colors.GrayColor,
  },
});

export default ModalSearch;
