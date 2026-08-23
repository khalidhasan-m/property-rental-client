import { PropertyDetailClient } from "@/components/PropertyDetailClient";
export default async function PropertyDetailsPage({ params }) {
    const { id } = await params;
    return <PropertyDetailClient id={id}/>;
}
