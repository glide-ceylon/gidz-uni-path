import { supabase } from "../../../lib/supabase";

export async function GET(request) {
  try {
    // Fetch active checklist items ordered by display_order
    const { data: checklistItems, error } = await supabase
      .from("gidz_buddy_checklist")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching checklist items:", error);
      return Response.json(
        { error: "Failed to fetch checklist items" },
        { status: 500 }
      );
    }

    // Transform the data to match the frontend format
    const transformedItems = checklistItems.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      youtubeLink: item.youtube_link,
      displayOrder: item.display_order,
    }));

    return Response.json({
      success: true,
      data: transformedItems,
    });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      item_id,
      title,
      description,
      priority,
      category,
      icon,
      action_text,
      estimated_time,
      impact,
      youtube_link,
      youtube_title,
      next_steps,
      display_order,
    } = body;

    // Validate required fields
    if (
      !item_id ||
      !title ||
      !description ||
      !category ||
      !icon ||
      !action_text
    ) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert new checklist item
    const { data, error } = await supabase
      .from("gidz_buddy_checklist")
      .insert([
        {
          item_id,
          title,
          description,
          priority: priority || 1,
          category,
          icon,
          action_text,
          estimated_time: estimated_time || "30 minutes",
          impact: impact || "Medium",
          youtube_link,
          youtube_title,
          next_steps: next_steps || [],
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

export async function PUT(request) {
  try {
    const body = await request.json();
    const {
      id,
      item_id,
      title,
      description,
      priority,
      category,
      icon,
      action_text,
      estimated_time,
      impact,
      youtube_link,
      youtube_title,
      next_steps,
      display_order,
      is_active,
    } = body;

    // Validate required fields
    if (!id || !title || !description || !category || !icon || !action_text) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update checklist item
    const { data, error } = await supabase
      .from("gidz_buddy_checklist")
      .update({
        title,
        description,
        priority: priority || 1,
        category,
        icon,
        action_text,
        estimated_time: estimated_time || "30 minutes",
        impact: impact || "Medium",
        youtube_link,
        youtube_title,
        next_steps: next_steps || [],
        display_order: display_order || 0,
        is_active: is_active !== undefined ? is_active : true,
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating checklist item:", error);
      return Response.json(
        { error: "Failed to update checklist item" },
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
