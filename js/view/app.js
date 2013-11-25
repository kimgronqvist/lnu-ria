define(function (require) {
    'use strict';

    var $ = require('jquery'),
        Backbone = require('backbone'),
        _ = require('underscore'),
        RecipesCollection = require('collection/recipes'),
        RecipesView = require('view/recipes');

    return Backbone.View.extend({
        _collectionBinder: undefined,
        filteredCollection: null,
        recipesCollection: null,
        
        modelCreateCount: 3,

        el: 'body',

        // Delegated events
        events: {
            'click #createModel': 'createModel',
            'click #removeModel': 'removeModel',
            'click #resetCollection': 'resetCollection',
            'keyup #filter': 'filter'
        },

        viewCreator: function (model) { return new RecipesView({model: model}); },
        
        initialize: function () {
            _.bindAll(this, 'render'); // fixes loss of context for 'this' within methods
            var elManagerFactory = new Backbone.CollectionBinder.ViewManagerFactory(this.viewCreator);
            this._collectionBinder = new Backbone.CollectionBinder(elManagerFactory);
        },

        render: function () {            
            var recipes = [
                {
                    name: 'recept1',
                    instructions: 'instruction one',
                    category: 'soppa'
                },
                {
                    name: 'recept2',
                    instructions: 'instruction two',
                    category: 'hey'
                },
                {
                    name: 'recept3',
                    instructions: 'instruction three',
                    category: 'yo'
                }
            ];

            this.recipesCollection = new RecipesCollection(recipes);
            this.filteredCollection = new RecipesCollection(recipes);

            this._collectionBinder.bind(this.filteredCollection, this.$('tbody'));

            return this;
        },

        createModel: function () {
            this.modelCreateCount++;
            this.filteredCollection.add({name: 'recept ' + this.modelCreateCount, category: 'yoyo', instructions: 'instruction four'});
            this.recipesCollection.add({name: 'recept ' + this.modelCreateCount, category: 'yoyo', instructions: 'instruction four'});
        },

        removeModel: function () {
            if(this.filteredCollection.length > 0){
                this.filteredCollection.remove(this.filteredCollection.at(this.filteredCollection.length - 1));
                this.recipesCollection.remove(this.recipesCollection.at(this.recipesCollection.length - 1));
            }
        },

        resetCollection: function () {
            this.filteredCollection.reset(this.recipesCollection.models);
        },

        filter: function (e) {
            var filterValue = $(e.currentTarget).val();
            this.filteredCollection.reset(this.recipesCollection.models);
            this.filteredCollection.reset(this.filteredCollection.filterCollection(filterValue));
        },

        close: function () {
            this._collectionBinder.unbind();
        }

    });
});