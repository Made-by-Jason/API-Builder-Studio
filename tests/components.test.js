describe('React Components', () => {

    // Mock React and React Testing Library functions are available from test.html
    const { useState } = React;
    const { render, fireEvent, screen } = ReactTestingLibrary;

    describe('HistoryView', () => {
        const mockHistory = [
            {
                endpointConfig: { method: 'GET', path: '/users' },
                response: { status: 200, responseTime: 120 },
                timestamp: '2023-01-01 10:00:00'
            },
            {
                endpointConfig: { method: 'POST', path: '/products' },
                response: { status: 404, responseTime: 250 },
                timestamp: '2023-01-01 10:05:00'
            }
        ];

        let loadFromHistoryCalledWith = null;
        let clearHistoryCalled = false;

        const mockLoadFromHistory = (index) => {
            loadFromHistoryCalledWith = index;
        };

        const mockClearHistory = () => {
            clearHistoryCalled = true;
        };

        beforeEach(() => {
            // Reset spies before each test
            loadFromHistoryCalledWith = null;
            clearHistoryCalled = false;
        });

        it('should render a message when history is empty', () => {
            render(
                React.createElement(HistoryView, {
                    requestHistory: [],
                    loadFromHistory: mockLoadFromHistory,
                    clearHistory: mockClearHistory
                })
            );
            expect(screen.getByText('No requests in history yet. Send a request to see it appear here!')).to.exist;
        });

        it('should render history items correctly', () => {
            render(
                React.createElement(HistoryView, {
                    requestHistory: mockHistory,
                    loadFromHistory: mockLoadFromHistory,
                    clearHistory: mockClearHistory
                })
            );

            // Check for first item
            expect(screen.getByText('200')).to.exist;
            expect(screen.getByText('GET')).to.exist;
            expect(screen.getByText('/users')).to.exist;
            expect(screen.getByText('Response Time: 120ms')).to.exist;

            // Check for second item
            expect(screen.getByText('404')).to.exist;
            expect(screen.getByText('POST')).to.exist;
            expect(screen.getByText('/products')).to.exist;
            expect(screen.getByText('Response Time: 250ms')).to.exist;
        });

        it('should call loadFromHistory with the correct index when a "Load" button is clicked', () => {
            render(
                React.createElement(HistoryView, {
                    requestHistory: mockHistory,
                    loadFromHistory: mockLoadFromHistory,
                    clearHistory: mockClearHistory
                })
            );

            const loadButtons = screen.getAllByText('Load');
            fireEvent.click(loadButtons[1]); // Click the "Load" button for the second item

            expect(loadFromHistoryCalledWith).to.equal(1);
        });

        it('should call clearHistory when the "Clear History" button is clicked', () => {
            render(
                React.createElement(HistoryView, {
                    requestHistory: mockHistory,
                    loadFromHistory: mockLoadFromHistory,
                    clearHistory: mockClearHistory
                })
            );

            const clearButton = screen.getByText('Clear History');
            fireEvent.click(clearButton);

            expect(clearHistoryCalled).to.be.true;
        });
    });

    describe('exportConfig', () => {
        const mockEndpoint = {
            method: 'GET',
            baseUrl: 'https://api.test.com',
            path: '/data',
            queryParams: [{ key: 'id', value: '123', required: true }],
            headers: [{ key: 'X-Test', value: 'true', required: false }],
            body: '',
            bodyType: 'json',
        };

        it('should generate the correct JSON configuration', () => {
            const { content, filename } = exportConfig('json', mockEndpoint, true);
            expect(filename).to.equal('api-config.json');
            const parsedContent = JSON.parse(content);
            expect(parsedContent).to.deep.equal(mockEndpoint);
        });

        it('should generate the correct Postman collection', () => {
            const { content, filename } = exportConfig('postman', mockEndpoint, true);
            expect(filename).to.equal('postman-collection.json');
            const parsedContent = JSON.parse(content);
            expect(parsedContent.info.name).to.equal('API Builder Studio Collection');
            expect(parsedContent.item[0].name).to.equal('GET /data');
            expect(parsedContent.item[0].request.method).to.equal('GET');
            expect(parsedContent.item[0].request.url.raw).to.equal('https://api.test.com/data');
        });

        it('should generate the correct OpenAPI specification', () => {
            const { content, filename } = exportConfig('openapi', mockEndpoint, true);
            expect(filename).to.equal('openapi-spec.json');
            const parsedContent = JSON.parse(content);
            expect(parsedContent.openapi).to.equal('3.0.0');
            expect(parsedContent.paths['/data'].get.summary).to.equal('GET /data');
            expect(parsedContent.paths['/data'].get.parameters[0]).to.deep.equal({
                name: 'id',
                in: 'query',
                required: true,
                schema: { type: 'string' }
            });
        });
    });
});
