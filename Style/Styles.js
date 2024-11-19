import { StyleSheet } from "react-native";

const colors = {
  headerBackground: 'rgba(105, 160, 0, 1)', 
  pageBackground: 'rgba(255, 170, 151, 0.19)', 
  darkPageBackground: 'rgba(220, 183, 173, 1)',
  headerText: 'rgba(255, 255, 255, 1)',
  darkText: 'rgba(104, 77, 194, 0.8)',
  activeIcon: 'rgba(255, 255, 255, 1)',
  inactiveIcon: 'rgba(0, 0, 2, 0.29)',
  errorMessage: 'red',
  border: "transparent",
  inputBackground: 'white',
  saveButton: 'rgba(67, 39, 156, 0.96)',
  cancelButton: 'rgba(222, 16, 119, 1)',
  inputBorder: 'lightgrey',
  buttonText: '',
  logoHeader:'rgba(105, 160, 0, 1)',
  logoHeaderBorderBottomColor:'rgba(255, 110, 0, 1)',
  tradeLogo:'rgba(255, 110, 0, 1)',
  searchBar: '#f0f0f0',
}
export const spacing = {
  small: 5,
  medium: 10,
  large: 15,
};

export const typography = {
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.small
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    margin: spacing.small
  },
  body: {
    fontSize: 14,
  },
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pageBackground,
    alignItems: 'center',
    paddingTop: 40,
  },
  searchBar: {
    height: 40,
    width: '90%',
    backgroundColor: colors.searchBar,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: typography.body.fontSize,
  },
  grid: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    alignItems: 'center',
    margin: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50, // Make the image circular
    resizeMode: 'cover',
  },
  categoryName: {
    marginTop: 5,
    fontSize: typography.body.fontSize,
    color: colors.headerBackground,
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
    backgroundColor: colors.pageBackground,
    alignItems: 'center',
  },
  listSeparator: {
    height: 3,
    marginVertical: 3,
    backgroundColor: colors.border,
  },
  productContainer: {
    backgroundColor: colors.darkPageBackground,
    padding: spacing.medium,
    margin: spacing.small,
  },  
  formContainer: {
    width: '90%',
    padding: spacing.large,
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    marginVertical: spacing.medium,
  },
  label: {
    fontSize: typography.subtitle.fontSize,
    fontWeight: typography.subtitle.fontWeight,
    color: colors.darkText,
    marginBottom: spacing.small,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.inputBackground,
    padding: spacing.medium,
    borderRadius: 5,
    marginBottom: spacing.medium,
    fontSize: typography.body.fontSize,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  picker: {
    height: 50,
    borderColor: colors.inputBorder,
    backgroundColor: colors.inputBackground,
    borderRadius: 5,
    paddingHorizontal: spacing.small,
    marginBottom: spacing.medium,
  },
  button: {
    padding: spacing.medium,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.small,
  },
  saveButton: {
    backgroundColor: colors.saveButton,
  },
  cancelButton: {
    backgroundColor: colors.cancelButton,
  },
  buttonText: {
    color: colors.headerBackground,
    fontWeight: 'bold',
    fontSize: typography.body.fontSize,
  },
  detailTitle: {
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
    marginBottom: spacing.small,
  },
  detailText: {
    fontSize: typography.body.fontSize,
    color: colors.darkText,
    marginBottom: spacing.small,
  },
  detailContainer: {
    padding: spacing.medium,
    backgroundColor: 'white',
  },
  pressablePressed: {
    backgroundColor: colors.headerBackground,
    opacity: 0.2,
  },
  pressable: {
    backgroundColor:'white',
    width:150,
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
});