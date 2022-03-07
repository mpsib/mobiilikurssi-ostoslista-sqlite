import { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('shoppinglist.db');

export default function App() {

  const [shoppinglist, setShoppinglist] = useState([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  useEffect( () => {
    db.transaction( tx => {
      tx.executeSql('create table if not exists product (id integer primary key not null, amount text, name text);');
    }, null, updateList);
  }, []);

  const updateList = () => {
    db.transaction( tx => {
      tx.executeSql('select * from product;', [], (_, { rows }) => 
        setShoppinglist(rows._array)
      );
    }, null, null)
  };

  const saveItem = () => {
    db.transaction( tx => {
      tx.executeSql('insert into product (amount, name) values (?, ?);',
        [amount, name]);
    }, null, updateList)
  };

  const deleteItem = (id) => {
    db.transaction( tx => {
      tx.executeSql('delete from product where id = ?;', [id]);
    }, null, updateList )
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder='Product' 
        style={styles.input}
        onChangeText={ (name) => setName(name) }
        value={name}
      />
      <TextInput placeholder='Amount' 
        style={styles.input2}
        onChangeText={ (amount) => setAmount(amount) }
        value={amount}
      />
      <Button onPress={saveItem} title='Save'/>
      <Text style={styles.textHeader}>Shopping List</Text>
      <FlatList
        style={styles.list}
        keyExtractor={item => item.id.toString()}
        renderItem={ ({item}) => 
          <View style={styles.listContainer}>
            <Text style={styles.text}>{item.name}: {item.amount}</Text>
            <Text style={styles.bought}
              onPress={ () => deleteItem(item.id) }>
              Bought
            </Text>
          </View>
        }
        data={shoppinglist}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    marginTop: 30,
    fontSize: 18,
    width: 200,
    borderWidth: 1,
  },
  input2: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: 18,
    width: 200,
    borderWidth: 1,
  },
  text: {
    fontSize: 18,
  },
  textHeader: {
    marginTop: 25,
    fontSize: 20,
  },
  list: {
    marginLeft:'2%',
  },
  bought: {
    fontSize: 18,
    color: '#0000dd',
    marginLeft: 20,
  },
  listContainer: {
    flexDirection: 'row',
    alignItems:'center'
  },
});
