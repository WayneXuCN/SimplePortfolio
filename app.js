// Load content from JSON
let siteContent = {};

// Function to update favicon
const updateFavicon = (faviconConfig) => {
    if (faviconConfig) {
        // Remove existing favicon links
        const existingLinks = document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]');
        existingLinks.forEach(link => link.remove());

        // Add new favicon links
        const head = document.head;

        if (faviconConfig.ico) {
            const icoLink = document.createElement('link');
            icoLink.rel = 'icon';
            icoLink.type = 'image/x-icon';
            icoLink.href = faviconConfig.ico;
            head.appendChild(icoLink);
        }

        if (faviconConfig.appleTouchIcon) {
            const appleLink = document.createElement('link');
            appleLink.rel = 'apple-touch-icon';
            appleLink.sizes = '180x180';
            appleLink.href = faviconConfig.appleTouchIcon;
            head.appendChild(appleLink);
        }
    }
};

// Function to load JSON content
const loadContent = async () => {
    try {
        const response = await fetch('content.json');
        siteContent = await response.json();

        // Update favicon
        updateFavicon(siteContent.site?.favicon);

        ReactDOM.render(<App />, document.getElementById('root'));
    } catch (error) {
        console.error('Error loading content:', error);
        // Fallback content if JSON fails to load
        siteContent = {
            site: {
                title: "Wenjie Xu - Personal Website",
                author: "徐文杰",
                favicon: {
                    ico: "favicon.ico",
                    appleTouchIcon: "apple-touch-icon.png"
                }
            },
            header: { avatar: "https://picsum.photos/seed/avatar123/50/50.jpg", name: "徐文杰" },
            hero: { subtitle: "WENJIE XU", title: "少工作，多赚钱。<br />享受生活！", description: "Join us and witness every step as a one-person company grows from chaos to clarity — with <span class=\"underline\">MDFriday</span> as the engine behind it.", cta: "Get free weekly letters." },
            portfolio: { title: "Portfolio", items: [] },
            featuredPosts: { title: "Featured Posts", items: [], seeAllText: "See All Posts", seeAllUrl: "#" },
            footer: { copyright: "© 2025 All Rights Reserved.", socialLinks: [] }
        };

        // Update favicon with fallback
        updateFavicon(siteContent.site?.favicon);

        ReactDOM.render(<App />, document.getElementById('root'));
    }
};

// Component for portfolio items
const PortfolioItem = ({ item }) => {
    if (item.type === 'colorful') {
        return (
            <div className="relative overflow-hidden rounded-lg shadow-md card-hover" onClick={() => window.open(item.url, '_blank')}>
                <div className="w-full h-64 bg-purple-900 flex flex-col">
                    {item.colors.map((color, index) => (
                        <div key={index} className={`h-1/6 ${color}`}></div>
                    ))}
                </div>
                <div className="absolute inset-0 flex items-start p-6">
                    <h3 className="text-white text-2xl font-bold">{item.title}</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden rounded-lg shadow-md card-hover" onClick={() => window.open(item.url, '_blank')}>
            <img
                src={item.image}
                alt={item.title}
                className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 card-overlay flex items-end p-6">
                <h3 className="text-white text-2xl font-bold">{item.title}</h3>
            </div>
        </div>
    );
};

// Component for featured post items
const FeaturedPostItem = ({ item }) => {
    return (
        <div className="relative overflow-hidden rounded-lg shadow-md card-hover" onClick={() => window.open(item.url, '_blank')}>
            <img
                src={item.image}
                alt={item.title}
                className="w-full h-64 object-cover"
            />
            <div className={`absolute inset-0 ${item.overlayColor} ${item.overlayOpacity} card-overlay flex items-start p-6`}>
                <h3 className="text-white text-xl font-bold">{item.title}</h3>
            </div>
        </div>
    );
};

const App = () => {
    if (!siteContent.site) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="max-w-screen-lg mx-auto px-6 py-12">
            {/* Header */}
            <header className="flex justify-between items-center mb-20">
                <div className="flex items-center">
                    <img
                        src={siteContent.header.avatar}
                        alt={siteContent.header.name}
                        className="w-14 h-14 rounded-full mr-4"
                    />
                    <span className="font-medium text-gray-800 text-lg">{siteContent.header.name}</span>
                </div>
            </header>

            {/* Hero Section */}
            <section className="mb-32">
                <h1 className="text-red-500 text-sm font-bold mb-6 tracking-widest">{siteContent.hero.subtitle}</h1>
                <h2 className="text-6xl font-bold mb-8 leading-tight display-font tracking-tight" dangerouslySetInnerHTML={{ __html: siteContent.hero.title }} style={{ fontSize: 'clamp(3.5rem, 10vw, 5.5rem)', fontWeight: '700' }}></h2>
                <p className="text-2xl mb-6 text-gray-700 max-w-3xl leading-relaxed" dangerouslySetInnerHTML={{ __html: siteContent.hero.description }}></p>
                <p className="text-2xl text-gray-700 font-medium">
                    {siteContent.hero.cta}
                </p>
            </section>

            {/* Portfolio Section */}
            <section className="mb-32">
                <h2 className="text-3xl font-bold mb-8 display-font">{siteContent.portfolio.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {siteContent.portfolio.items.map(item => (
                        <PortfolioItem key={item.id} item={item} />
                    ))}
                </div>
            </section>

            {/* Featured Posts Section */}
            <section className="mb-32">
                <h2 className="text-3xl font-bold mb-8 display-font">{siteContent.featuredPosts.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {siteContent.featuredPosts.items.map(item => (
                        <FeaturedPostItem key={item.id} item={item} />
                    ))}
                </div>
                <div className="flex justify-end mt-8">
                    <a href={siteContent.featuredPosts.seeAllUrl} className="text-pink-500 font-medium flex items-center hover:text-pink-600 transition-colors text-lg">
                        {siteContent.featuredPosts.seeAllText} <i className="fas fa-arrow-right ml-2"></i>
                    </a>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-gray-200">
                <div className="flex justify-between items-center">
                    <p className="text-gray-600 text-lg">{siteContent.footer.copyright}</p>
                    <div className="flex space-x-6">
                        {siteContent.footer.socialLinks.map((link, index) => (
                            <a key={index} href={link.url} className="text-gray-600 hover:text-gray-900 transition-colors social-icon text-xl" title={link.title || ''}>
                                {link.imageUrl ? (
                                    <img src={link.imageUrl} alt={link.title} className="w-full h-full object-contain" />
                                ) : (
                                    <i className={link.icon}></i>
                                )}
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Initialize the app
loadContent();