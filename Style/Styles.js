import { StyleSheet } from "react-native";

const colors = {

  headerBackground: 'rgba(22, 146, 106, 0.9)',
  pageBackground: 'rgba(0, 0, 0, 0)', 
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
  buttonText: 'rgba(245, 238, 11, 0.8)',
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
    fontSize: 16,
  },
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pageBackground,
    paddingTop: 20,
    marginHorizontal:20
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
    color: 'rgba(31, 97, 76, 0.9)',
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
    backgroundColor: colors.pageBackground,
    alignItems: 'center',
    top: 10,
  },
  listSeparator: {
    height: 3,
    marginVertical: 1,
    backgroundColor: colors.border,
  },
  // productContainer: {
  //   backgroundColor: colors.pageBackground,
  //   padding: spacing.medium,
  
  // },  
  formContainer: {
    flex:1,
    padding: spacing.large,
    backgroundColor: colors.pageBackground,
    borderRadius: 8,
    // marginVertical: spacing.medium,
  },
  label: {
    fontSize: 15,
    color: 'rgba(41, 88, 87, 0.99)',

  },
  authPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',

  },

  input: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.inputBackground,
    paddingVertical: spacing.medium, 
    paddingHorizontal: spacing.medium, 
    borderRadius: 5,
    marginBottom: spacing.medium,
    fontSize: typography.body.fontSize,
    width: '100%',


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
    backgroundColor:colors.pageBackground,
    width:"95%",
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
    justifyContent: 'center',
    position: 'relative',
  },
  authText: {
    padding:10,
    fontSize:typography.body.fontSize
  },
  buttonContainer: {
    padding:10
  },
  detailRow: {
    flexDirection: "row",
    alignItems: 'center',
    width:'80%',
  },

  largePressable: {
    backgroundColor: colors.headerBackground,
    width:"100%",
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
    justifyContent: 'center',
    position: 'relative',
    alignItems: 'center',
  },
   
  errorText: {
    color: colors.errorMessage,
    marginBottom: 10,
  },


});