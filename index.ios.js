/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  MapRegionInput,
  MapView,
  TabBarIOS,
} = React;

var regionText = {
  latitude: '0',
  longitude: '0',
  latitudeDelta: '0',
  longitudeDelta: '0',
};

var mapper = React.createClass({
  render: function () {
    return (
      <MainTabBar>
        <ScrollView style={styles.mainScrollView} contentContainerStyle={styles.container}>
          <Text style={styles.welcome}>
            Welcome to mapper!
          </Text>
          <MainMapView/>
        </ScrollView>
      </MainTabBar>
    );
  }
});

var MainTabBar = React.createClass({
  statics: {
    title: '<TabBarIOS>',
    description: 'Tab-based navigation.'
  },

  getInitialState: function() {
    return {
      selectedTab: 'mapTab',
      notifCount: 0,
      presses: 0,
    };
  },

  _renderContent: function(color: string, pageText: string) {
    return (
      <View style={[styles.tabContent, {backgroundColor: color}]}>
        <Text style={styles.tabText}>{pageText}</Text>
        <Text style={styles.tabText}>{this.state.presses} re-renders of the More tab</Text>
      </View>
    );
  },

  render: function() {
    return (
      <TabBarIOS>
        <TabBarIOS.Item
          systemIcon="history"
          badge={this.state.notifCount > 0 ? this.state.notifCount : undefined}
          selected={this.state.selectedTab === 'redTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'redTab',
              notifCount: this.state.notifCount + 1,
            });
          }}>
          {this._renderContent('#783E33', 'Red Tab')}
        </TabBarIOS.Item>

        <TabBarIOS.Item
          systemIcon="favorites"
          title="Map"
          selected={this.state.selectedTab === 'mapTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'mapTab',
            });
          }}>
          <ScrollView style={styles.mainScrollView} contentContainerStyle={styles.container}>
            <Text style={styles.welcome}>
              Welcome to mapper!
            </Text>
            <MainMapView/>
          </ScrollView>
        </TabBarIOS.Item>

        <TabBarIOS.Item
          systemIcon="more"
          selected={this.state.selectedTab === 'greenTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'greenTab',
              presses: this.state.presses + 1
            });
          }}>
          {this._renderContent('#21551C', 'Green Tab')}
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  },
});

var MapRegionInput = React.createClass({

  propTypes: {
    region: React.PropTypes.shape({
      latitude: React.PropTypes.number.isRequired,
      longitude: React.PropTypes.number.isRequired,
      latitudeDelta: React.PropTypes.number.isRequired,
      longitudeDelta: React.PropTypes.number.isRequired,
    }),
    onChange: React.PropTypes.func.isRequired,
  },

  getInitialState: function() {
    return {
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
      }
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      region: nextProps.region || this.getInitialState().region
    });
  },

  render: function() {
    var region = this.state.region || this.getInitialState().region;
    return (
      <View>
        <View style={styles.row}>
          <Text>
            {'Latitude'}
          </Text>
          <TextInput
            value={'' + region.latitude}
            style={styles.textInput}
            onChange={this._onChangeLatitude}
            selectTextOnFocus={true}
          />
        </View>
        <View style={styles.row}>
          <Text>
            {'Longitude'}
          </Text>
          <TextInput
            value={'' + region.longitude}
            style={styles.textInput}
            onChange={this._onChangeLongitude}
            selectTextOnFocus={true}
          />
        </View>
        <View style={styles.row}>
          <Text>
            {'Latitude delta'}
          </Text>
          <TextInput
            value={'' + region.latitudeDelta}
            style={styles.textInput}
            onChange={this._onChangeLatitudeDelta}
            selectTextOnFocus={true}
          />
        </View>
        <View style={styles.row}>
          <Text>
            {'Longitude delta'}
          </Text>
          <TextInput
            value={'' + region.longitudeDelta}
            style={styles.textInput}
            onChange={this._onChangeLongitudeDelta}
            selectTextOnFocus={true}
          />
        </View>
        <View style={styles.changeButton}>
          <Text onPress={this._change}>
            {'Add HotSpot'}
          </Text>
        </View>
      </View>
    );
  },

  _onChangeLatitude: function(e) {
    regionText.latitude = e.nativeEvent.text;
  },

  _onChangeLongitude: function(e) {
    regionText.longitude = e.nativeEvent.text;
  },

  _onChangeLatitudeDelta: function(e) {
    regionText.latitudeDelta = e.nativeEvent.text;
  },

  _onChangeLongitudeDelta: function(e) {
    regionText.longitudeDelta = e.nativeEvent.text;
  },

  _change: function() {
    this.setState({
      latitude: parseFloat(regionText.latitude),
      longitude: parseFloat(regionText.longitude),
      latitudeDelta: parseFloat(regionText.latitudeDelta),
      longitudeDelta: parseFloat(regionText.longitudeDelta),
    });
    this.props.onChange(this.state.region);
  },

});

var MainMapView = React.createClass({

  getInitialState: function () {
    return {
      mapRegion: null,
      mapRegionInput: null,
      annotations: [],
      isFirstLoad: true,
    };
  },

  render: function () {
    return (
      <View>
        <MapView
          style={styles.map}
          onRegionChange={this._onRegionChange}
          onRegionChangeComplete={this._onRegionChangeComplete}
          region={this.state.mapRegion}
          annotations={this.state.annotations} />
        <MapRegionInput
          onChange={this._onRegionInputChanged}
          region={this.state.mapRegionInput || undefined} />
      </View>
    );
  },

  makeAnnotation: function (region, title) {
    return {
      longitude: region.longitude,
      latitude: region.latitude,
      title: title,
    };
  },

  _onRegionChange: function (region) {
    this.setState({
      mapRegionInput: region,
    });
  },

  _onRegionChangeComplete: function (region) {
    if (this.state.isFirstLoad) {
      this.setState({
        mapRegionInput: region,
        annotations: this.state.annotations,
        isFirstLoad: false,
      });
    }
  },

  _onRegionInputChanged: function (region) {
    var annotationNumber = this.state.annotations.length + 1;
    var newAnnotation = this.makeAnnotation(region, "HotSpot #" + annotationNumber);

    this.setState({
      mapRegion: region,
      mapRegionInput: region,
      annotations: this.state.annotations.concat(newAnnotation),
    });
  },

});

var styles = StyleSheet.create({
  welcome: {
    fontSize: 24,
  },
  tabContent: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: 'white',
    margin: 50,
  },
  mainScrollView: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  container: {
    marginTop: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    height: 320,
    margin: 10,
    borderWidth: 1,
    borderColor: '#000000',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInput: {
    width: 150,
    height: 20,
    borderWidth: 0.5,
    borderColor: '#aaaaaa',
    fontSize: 13,
    padding: 4,
    marginBottom: 15,
  },
  changeButton: {
    alignSelf: 'center',
    padding: 3,
    borderWidth: 0.5,
    borderColor: '#777777',
    marginBottom: 15,
  },
});

AppRegistry.registerComponent('mapper', () => mapper);
