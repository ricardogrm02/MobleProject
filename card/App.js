import React, { createContext, useEffect, useState } from 'react';
import {StyleSheet, View, TextInput, Button, SafeAreaView,Text, ScrollView, Pressable, Dimensions, ImageBackground, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
// import { useNavigation } from '@react-navigation/native';

const Stack = createNativeStackNavigator();
const AppContext = createContext();

const screenHeight = Dimensions.get('window').height; 
const screenWidth = Dimensions.get('window').width; 

function HomeScreen ({navigation})  {
  const context = React.useContext(AppContext)
 //Array that will contain 
  const [board, setGameBoard] = useState(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState('X')
  const [playerName, setPlayerName] = useState('')
  const [playerList, setPlayerList] = useState(Array(0).fill(''));
  const [lastCell, setLastCell] = useState(0)
  

//Only fill a cell at some index position if its empty DO NOT OVERWRITE CELL WITH VALUE

/*
  <Text style = {{color: context.playerOneColor, fontSize: 20, fontWeight: 'bold'}}>Player One Current Color: {context.playerOneColor} </Text>
      <Text style = {{color: context.playerTwoColor, fontSize: 20, fontWeight: 'bold'}}>Player Two Current Color: {context.playerTwoColor} </Text>
*/
//Set all Values in the array to be null to represent empty grid
//X will always begin first

//Compare Contents to winning lines
  const DetectWin = (board) => {
    const winningLines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [0, 4, 7], [2,5,8], [0, 4, 8], [2, 4, 6]];
    for (let x = 0; x < winningLines.length; x++) {
      const [first, second, third] = winningLines[x]
      if (board[first] == board[second] && board[second] == board[third] && board[first] != null) {
        return board[first];
      }
    }
    return null;
  }
  //Current Player Forefits

//Monitors for a winner. Checks the board state when updated. Automatically resets game
  useEffect(() => {
    const winner = DetectWin(board);
    if (winner === 'X') {
      alert(playerList.at(0) + " (X) Won!")
      newGame();
    } else if (winner === 'O'){
      alert(playerList.at(1) + " (O) Won!")
      newGame();
    } else if (winner === null && board.indexOf(null) === -1) {
      alert("Its a Cats Game!")
      newGame();
    }
  }, [board])

  return (
  <SafeAreaView style = {styles.screen}>
    <View style={[styles.playerDisplay, {backgroundColor: currentPlayer === 'X' ? context.playerOneColor: context.playerTwoColor }]}>
      <Text style = {[styles.playerName]}> CARD CALAMITY COLLECTOR</Text>
    </View>
    <ImageBackground style = {styles.backgroundImage} source = {require('./images/hex_pattern.jpg')}>
      <View style = {{paddingTop: 20, rowGap: 50, width: 150, justifyContent: 'center', alignItems: 'center', left: 5}}>
        <Button title = "Edit Deck"   onPress = {() => {navigation.navigate('Second')}} />
        <Button title = "View Collection" style = {styles.buttonRight} onPress = {() => {navigation.navigate('Third')}}/>
        <Button title = "Card Search" onPress={() => {navigation.navigate('Fourth')}}></Button>
        <Button title = "Card Creation" onPress={() => {navigation.navigate('Fifth')}}></Button>
        <Button title = "About" onPress={() => {navigation.navigate('Sixth')}}></Button>
      </View>
      <Image style = {{height: 150, width: 150, flex: 1, resizeMode: 'contain', justifyContent: 'center', left: screenWidth * .55, bottom: screenHeight * .45}} source = {require('./images/broly.jpg')}></Image>
      <Image style = {{height: 150, width: 150, flex: 1, resizeMode: 'contain', justifyContent: 'center', left: screenWidth * .50, bottom: screenHeight * .35}} source = {require('./images/blue_eyes.jpg')}></Image>
      <Image style = {{height: 150, width: 150, flex: 1, resizeMode: 'contain', justifyContent: 'center', left: screenWidth * .55, bottom: screenHeight * .25}} source = {require('./images/fat_pika.jpg')}></Image> 
    </ImageBackground>
  </SafeAreaView>
);
}

function EditDeckScreen({navigation}) {
  const context = React.useContext(AppContext);
  return (
    <SafeAreaView style={styles.screen}>
      
      <View style = {{height: 100, width: 100, left: screenWidth / 2 - 45, bottom: screenHeight / 3, marginBottom: 10}}>
        <Image style = {{height: 100, width: 100, flex: 1, resizeMode: 'contain', justifyContent: 'center', left: 0, top: 270}} source = {require('./images/deck.jpg')}></Image>
      </View>
      <View style = {styles.ViewSeperator}>
        <Text style = {{color: 'white'}}>CARDS IN DECK</Text>
      </View>
      <ScrollView style = {styles.collection}>
        <View style = {styles.collectionContent}>
        {context.deck.map((item) => {
          return (
          <Pressable onPress={() => {context.DeleteCardFromDeck(item.name)}}>
          <Image style = {{height: 125, width: 125,  resizeMode: 'contain'}} source = {{uri: item.name}}></Image>
          </Pressable>
          )
        })}
        </View>
      </ScrollView>
      <View style = {styles.ViewSeperator}>
        <Text style = {{color: 'white'}}>CARDS IN COLLECTION</Text>
      </View>
      <ScrollView style = {styles.collection}>
      <View style = {styles.collectionContent}> 
      {context.collection.map((item) => {
          return (
            /* For Every item in the Collection Array Store Display that image */
          <Pressable onPress={() => {context.AddCardToDeck(item.name)}}>
          <Image style = {{height: 125, width: 125,  resizeMode: 'contain'}} source = {{uri: item.name}}></Image>
          </Pressable>
          )
        })}
      </View>
      </ScrollView>
    </SafeAreaView>
 
  );
}

function CardSearchScreen({navigation}) {
  const context = React.useContext(AppContext);
    /*POTENTIAL API: https://ygoprodeck.com/api-guide/*/
  return(
<SafeAreaView style= {styles.screen}>
    <Text style = {{color: '#FFFFFF'}}>Card Search Screen</Text>
    <Pressable>
    <View style = {{left: screenWidth / 2 - 90, height: 200, width: 180, justifyContent: 'center', backgroundColor: '#fdf5c4', borderColor:'#FFFFFF', borderWidth: 1, paddingTop: 10, paddingBottom: 10}}>
    <Image style = {{height: 150, width: 150, flex: 1, resizeMode: 'contain', left: 15}} source = {require('./images/search.jpg')}></Image>
    </View>
    </Pressable>
    <View style = {styles.divider}>
      <Text>IMAGE PREVIEW HERE</Text>
    </View>
    <View style = {{paddingTop: 20}}> 
    <Button title='Add to Deck'></Button>
    <Button title='View Collection' onPress={() => {navigation.navigate('Third')} }></Button>
    <Button title='Edit Deck'  onPress={() => {navigation.navigate('Second')} }></Button>
    </View>
    </SafeAreaView>
  );

}

function CardCreationScreen({navigation}) {
  const context = React.useContext(AppContext);
  /* USING CAMERA*/
    return(
    <SafeAreaView style= {styles.screen}>
    <Text style = {{color: '#FFFFFF'}}>Card Creation Screen</Text>
    <Pressable>
    <View style = {{left: screenWidth / 2 - 90, height: 200, width: 180, justifyContent: 'center', backgroundColor: '#fdf5c4', borderColor:'#FFFFFF', borderWidth: 1, paddingTop: 10, paddingBottom: 10}}>
    <Image style = {{height: 150, width: 150, flex: 1, resizeMode: 'contain', left: 15}} source = {require('./images/camera_icon.jpg')}></Image>
    </View>
    </Pressable>
    <View style = {styles.divider}>
        <Text>IMAGE PREVIEW HERE</Text>
    </View>
    <View style = {{paddingTop: 20}}> 
    <Button title='Add to Deck'></Button>
    <Button title='View Collection' onPress={() => {navigation.navigate('Third')} }></Button>
    <Button title='Edit Deck'  onPress={() => {navigation.navigate('Second')} }></Button>
    </View>
    </SafeAreaView>
    );
}

function CollectionScreen({navigation}) {
  const context = React.useContext(AppContext);
    return(
    <SafeAreaView style = {styles.screen}>
      <View style = {{height: 200, width: 180, justifyContent: 'center', backgroundColor: '#201F41', borderColor:'#FFFFFF', borderWidth: 1}}>
        <ImageBackground style = {{height: 200, width: 175}} source = {require('./images/hex_pattern.jpg')}>
          <Image style = {{height: 150, width: 150, flex: 1, resizeMode: 'contain', left: 15}} source = {require('./images/broly.jpg')}></Image>
        </ImageBackground>
      </View>
      <View style = {styles.ViewSeperator}>
        <Text style = {{color: 'white'}}>Scroll to View Collection</Text>
      </View>
      <ScrollView>
       <View style = {styles.collectionContent}>
        {context.collection.map((item) => {
          return (
          <Pressable>
          <Image style = {{height: 125, width: 125,  resizeMode: 'contain'}} source = {{uri: item.name}}></Image>
          </Pressable>
          )
        })}
       </View>
      </ScrollView>
    </SafeAreaView>
    );
}

function AboutScreen({navigation}) {
  return(
  <View style= {styles.screen}>
  <Text style = {{color: 'white'}}>I am Ricardo Granados Macias, and I am a 4th year computer science major. 
    This is my application called card calamity! It's all about collecting your favorite cards, creating original ones, 
    and editing them all into the deck of your dreams!
    Link to github: https://github.com/ricardogrm02/MobleProj
  </Text>
  </View>
  );
}


const App = () => {
//State that updates the color of the players
 const [playerOneColor, setPlayerOneColor] = useState('red');
 const [playerTwoColor, setPlayerTwoColor] = useState('blue');
 const [deck, setDeck] = useState([{name: 'https://m.media-amazon.com/images/I/51sRtX0aLkL._AC_UF894,1000_QL80_.jpg'}]);
 const [card, setCard] = useState();
 const [collection, setCollection] = useState([
  {name: 'https://m.media-amazon.com/images/I/51sRtX0aLkL._AC_UF894,1000_QL80_.jpg'}, 
  {name: 'https://product-images.tcgplayer.com/512092.jpg'}, 
  {name: 'https://m.media-amazon.com/images/I/51CQbWyA7FL._AC_UF894,1000_QL80_.jpg'}, 
  {name: 'https://m.media-amazon.com/images/I/51CQbWyA7FL._AC_UF894,1000_QL80_.jpg'}, 
  {name: 'https://m.media-amazon.com/images/I/51CQbWyA7FL._AC_UF894,1000_QL80_.jpg'}, 
  {name: 'https://m.media-amazon.com/images/I/51CQbWyA7FL._AC_UF894,1000_QL80_.jpg'}, 
  {name: 'https://m.media-amazon.com/images/I/51CQbWyA7FL._AC_UF894,1000_QL80_.jpg'}, 
  {name: 'https://m.media-amazon.com/images/I/51CQbWyA7FL._AC_UF894,1000_QL80_.jpg'}, 
  {name: 'https://m.media-amazon.com/images/I/51CQbWyA7FL._AC_UF894,1000_QL80_.jpg'}, 
  {name: 'https://m.media-amazon.com/images/I/51CQbWyA7FL._AC_UF894,1000_QL80_.jpg'}, 
  {name: 'https://m.media-amazon.com/images/I/51Vp2yeBDnL._AC_UF894,1000_QL80_.jpg'}]);
  const AddCardToDeck = (card_source) => {
    setDeck([...deck, {name: card_source}])
  }
  const DeleteCardFromDeck = (card_source) => {
   const updatedDeck = deck.filter(image => image.name != card_source)
   setDeck(updatedDeck)
  }
 //Context Value to allow the state ot be accessed across multiple screens
 const contextValue = {
  playerOneColor, playerTwoColor, setPlayerOneColor, setPlayerTwoColor, card, deck, setDeck, setCard, collection, setCollection,  AddCardToDeck, DeleteCardFromDeck
 };

return (
  <AppContext.Provider value ={contextValue} > 
 <NavigationContainer>
     <Stack.Navigator initialRouteName='First'>
      <Stack.Screen name = 'First' component={HomeScreen} backgroundColor = '#00876E' options = {{title: "Home Screen"}} />
      <Stack.Screen name = 'Second' component = {EditDeckScreen} options = {{title: "Edit Deck Screen"}}/>
      <Stack.Screen name = 'Third' component={CollectionScreen}  options = {{title: "Collection"}}/>
      <Stack.Screen name = 'Fourth' component= {CardSearchScreen}  options = {{title: "Card Search Screen"}}/>
      <Stack.Screen name = 'Fifth' component={CardCreationScreen}  options = {{title: "Card Creation Screen"}}/>
      <Stack.Screen name = 'Sixth' component={AboutScreen}  options = {{title: "About Screen"}}/>
    </Stack.Navigator>
  </NavigationContainer> 
  </AppContext.Provider>
  );
};

const styles = StyleSheet.create({
screen: {
  flex: 1,
  backgroundColor: '#201F41'
},

backgroundImage: {
height: screenHeight,
width: screenWidth,
alignContent: 'center',
justifyContent: 'center',
},

buttonLeft: {
  position: 'absolute',
  left: 10, // Adjust this value to position the button as desired
  bottom: 50, // Adjust this value to position the button as desired
  padding: 10,
  borderRadius: 5,
  justifyContent: 'flex-end'
  
},

buttonRight: {
  position: 'absolute',
  right: 10, // Adjust this value to position the button as desired
  bottom: 10, // Adjust this value to position the button as desired
  padding: 10,
  border6Radius: 5,
  justifyContent: 'flex-end'
},

input: {
  width: '80%',
  borderColor: 'black',
  borderWidth: 2,
  padding: 10,
  flex: 1,
  justifyContent: 'center'
},

listItem: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderColor: 'grey',
  borderWidth: 1,
  marginVertical: 10,
  padding: 10
},


textFormat: {
  justifyContent: 'center',
  alignItems: 'center',
  padding: 10,
  backgroundColor: '#ffffff',
  borderColor: 'black',
  borderRadius: 10,
  width: 300,
  left: 50,
  borderWidth: 1
},

 buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingBottom: 20, // Add padding to create space between the buttons and the bottom of the screen
  },

  playerDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignIems: 'center'
  },
  
  playerName: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1.2
  },

  gameBoard: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 50
  },

  cell: {
    width: 100,
    height: 100, 
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3
  },

  cellContent: {
    fontWeight: 'bold',
    fontSize: 20
  },

  settingScreen: {
    justifyContent: 'center',
    backgroundColor: '#009193',
    alignContent: 'row',
    flex: 1
  },

  textInputContainer: {
    height: 200,
    wdith: 180,
    padding: 50,
    rowGap: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },

  divider: {
    height: 100,
    paddingTop: 10,
    paddingBottom: 10,
    width: 180,
    height: 200,
    borderColor: 'white',
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    alignContent: 'center',
    justifyContent: 'center',
    left: screenWidth / 2 - 90,
    marginTop: 10
  },

  ViewSeperator : {
    width: screenWidth,
    marginTop: 10,
    borderColor: '#FFFFFF',
    backgroundColor: '#2B35AF',
    height: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  }, 

  collection : {
    height: screenHeight / 5
  },

  collectionContent : {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 5,
    rowGap: 8,
    justifyContent: 'left',
    alignItems: 'center',
    left: 10
  }
});

export default App;