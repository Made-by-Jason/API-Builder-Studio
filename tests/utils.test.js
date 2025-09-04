describe('Utility Functions', () => {

    describe('inferSchema', () => {

        it('should correctly infer basic data types', () => {
            expect(inferSchema("hello")).to.deep.equal({ type: 'string' });
            expect(inferSchema(123)).to.deep.equal({ type: 'number' });
            expect(inferSchema(true)).to.deep.equal({ type: 'boolean' });
            expect(inferSchema(null)).to.deep.equal({ type: 'null' });
        });

        it('should correctly infer a flat object', () => {
            const flatObject = {
                name: "John Doe",
                age: 30,
                isStudent: false
            };
            const expectedSchema = {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    age: { type: 'number' },
                    isStudent: { type: 'boolean' }
                },
                required: ['name', 'age', 'isStudent']
            };
            expect(inferSchema(flatObject)).to.deep.equal(expectedSchema);
        });

        it('should correctly infer an object with nested objects', () => {
            const nestedObject = {
                user: {
                    id: 1,
                    details: {
                        email: "test@example.com"
                    }
                }
            };
            const expectedSchema = {
                type: 'object',
                properties: {
                    user: {
                        type: 'object',
                        properties: {
                            id: { type: 'number' },
                            details: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string' }
                                },
                                required: ['email']
                            }
                        },
                        required: ['id', 'details']
                    }
                },
                required: ['user']
            };
            expect(inferSchema(nestedObject)).to.deep.equal(expectedSchema);
        });

        it('should correctly infer an array of strings', () => {
            const stringArray = ["apple", "banana", "cherry"];
            const expectedSchema = {
                type: 'array',
                items: { type: 'string' }
            };
            expect(inferSchema(stringArray)).to.deep.equal(expectedSchema);
        });

        it('should correctly infer an array of objects', () => {
            const objectArray = [{ id: 1 }, { id: 2 }];
            const expectedSchema = {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' }
                    },
                    required: ['id']
                }
            };
            expect(inferSchema(objectArray)).to.deep.equal(expectedSchema);
        });

        it('should handle empty objects and arrays', () => {
            expect(inferSchema({})).to.deep.equal({ type: 'object', properties: {}, required: undefined });
            expect(inferSchema([])).to.deep.equal({ type: 'array', items: {} });
        });

        it('should respect the max depth parameter', () => {
            const deepObject = { a: { b: { c: { d: "too deep" } } } };
            const expectedSchema = {
                type: 'object',
                properties: {
                    a: {
                        type: 'object',
                        properties: {
                            b: {
                                type: 'object',
                                properties: {
                                    c: {
                                        type: 'string',
                                        description: 'Maximum depth reached, schema truncated.'
                                    }
                                },
                                required: ['c']
                            }
                        },
                        required: ['b']
                    }
                },
                required: ['a']
            };
            // Set maxDepth to 2 (0-indexed, so depth 0, 1, 2 are allowed)
            expect(inferSchema(deepObject, 2)).to.deep.equal(expectedSchema);
        });
    });
});
