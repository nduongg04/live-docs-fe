/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "kenh14cdn.com",
                port: "",
            },
			// I need to add all the domains that I want to allow
			{
				protocol: "https",
				hostname: "vcdn1-giaitri.vnecdn.net",
				port: "",
			},
			{
				protocol: "https",
				hostname: "www.google.com",
				port: "",
			}
        ],
    },
};

export default nextConfig;
