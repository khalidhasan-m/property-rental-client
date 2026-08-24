export function NestoraLogo({ className = "size-9", size = 36 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
        >
            {/* House Outer Outline */}
            <path
                d="M 60 18 L 26 44 V 76 H 94 V 44 Z"
                stroke="#1e293b"
                strokeWidth="5"
                strokeLinejoin="round"
                strokeLinecap="round"
            />

            {/* Chimney */}
            <path
                d="M 74 34 V 22 H 84 V 42"
                stroke="#1e293b"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Inner Teal Roof Accent */}
            <path
                d="M 60 27 L 33 48"
                stroke="#4ad0c0"
                strokeWidth="3.5"
                strokeLinecap="round"
            />
            <path
                d="M 60 27 L 87 48"
                stroke="#4ad0c0"
                strokeWidth="3.5"
                strokeLinecap="round"
            />

            {/* 4-Pane Window */}
            <rect x="49" y="52" width="9" height="9" rx="1.5" fill="#4ad0c0" />
            <rect x="62" y="52" width="9" height="9" rx="1.5" fill="#4ad0c0" />
            <rect x="49" y="65" width="9" height="9" rx="1.5" fill="#4ad0c0" />
            <rect x="62" y="65" width="9" height="9" rx="1.5" fill="#4ad0c0" />

            {/* Twig Nest Base - Interwoven Curved Branches */}
            <path
                d="M 14 62 C 34 88 86 88 106 62 C 84 94 36 94 14 62 Z"
                fill="#1e293b"
            />
            <path
                d="M 24 74 C 42 98 78 98 96 74 C 76 103 44 103 24 74 Z"
                fill="#1e293b"
            />
            <path
                d="M 32 86 C 48 106 72 106 88 86 C 72 110 48 110 32 86 Z"
                fill="#1e293b"
            />

            {/* Green Leaves */}
            {/* Left Top Leaf */}
            <path d="M 22 55 C 22 45 14 42 12 50 C 12 58 22 62 22 55 Z" fill="#22c55e" />
            {/* Left Outer Leaf */}
            <path d="M 12 67 C 6 62 2 68 8 72 C 14 74 16 70 12 67 Z" fill="#22c55e" />
            {/* Left Bottom Leaf */}
            <path d="M 26 90 C 20 86 16 93 22 96 C 28 98 30 94 26 90 Z" fill="#22c55e" />

            {/* Right Top Leaf */}
            <path d="M 98 55 C 98 45 106 42 108 50 C 108 58 98 62 98 55 Z" fill="#22c55e" />
            {/* Right Outer Branch Leaves */}
            <path d="M 108 67 C 114 62 118 68 112 72 C 106 74 104 70 108 67 Z" fill="#22c55e" />
            <path d="M 94 80 C 102 76 106 83 99 87 C 92 89 90 84 94 80 Z" fill="#22c55e" />
        </svg>
    );
}
