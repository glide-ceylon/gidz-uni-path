import { supabase } from "../../../lib/supabase";

export async function GET(request) {
  try {
    // Fetch checklist items ordered by display_order
    const { data: checklistItems, error } = await supabase
      .from("gidz_buddy_checklist")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching checklist items:", error);
      return Response.json(
        { error: "Failed to fetch checklist items" },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      data: checklistItems,
    });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, youtube_link, is_active, display_order } = body;

    // Validate required fields
    if (!title || !description) {
      return Response.json(
        {
          error: "Missing required fields: title and description are required",
        },
        { status: 400 }
      );
    }

    // Insert new checklist item
    const { data, error } = await supabase
      .from("gidz_buddy_checklist")
      .insert([
        {
          title,
          description,
          youtube_link: youtube_link || null,
          is_active: is_active !== undefined ? is_active : true,
          display_order: display_order || 0,
        },
      ])
      .select();

    if (error) {
      console.error("Error creating checklist item:", error);
      return Response.json(
        { error: "Failed to create checklist item" },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      data: data[0],
    });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "ID is required" }, { status: 400 });
    }

    // Delete checklist item
    const { error } = await supabase
      .from("gidz_buddy_checklist")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting checklist item:", error);
      return Response.json(
        { error: "Failed to delete checklist item" },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: "Checklist item deleted successfully",
    });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
