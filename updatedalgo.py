import pandas as pd

# Load metro cost excel sheet
def load_metro_cost_tiers(file_path):
    df = pd.read_excel(file_path)
    return dict(zip(df["Metro Area"], df["Cost Tier"]))

def calculate_paint_job_cost(num_rooms, square_footage, num_coats, metro_area, cost_tier_data):
    BASE_RATE_PER_SQ_FT = 2.00  
    ROOM_FEE = 50              
    COAT_MULTIPLIER = 1.35      

    PAINT_COST_PER_GALLON = 40  
    PAINT_COVERAGE_PER_GALLON = 350  
    PRIMER_COST_PER_GALLON = 15  
    PRIMER_COVERAGE_PER_GALLON = 300  
    SUPPLIES_COST = 50

    if num_rooms < 0 or square_footage < 0 or num_coats not in [1, 2]:
        raise ValueError("Invalid input. Ensure rooms and square footage are non-negative, and coats are 1 or 2.")

    base_cost = square_footage * BASE_RATE_PER_SQ_FT
    room_cost = num_rooms * ROOM_FEE
    coat_adjustment = 1.0 if num_coats == 1 else COAT_MULTIPLIER
    adjusted_base_cost = base_cost * coat_adjustment

    tier = cost_tier_data.get(metro_area)
    if tier == "High":
        metro_multiplier = 1.5
    elif tier == "Medium":
        metro_multiplier = 1.25
    elif tier == "Low":
        metro_multiplier = 1.0
    else:
        raise ValueError("Metro area not found in cost tier data.")

    total_cost_to_customer = (adjusted_base_cost + room_cost) * metro_multiplier

    paint_required = (square_footage * num_coats) / PAINT_COVERAGE_PER_GALLON
    paint_cost = paint_required * PAINT_COST_PER_GALLON
    primer_required = square_footage / PRIMER_COVERAGE_PER_GALLON
    primer_cost = primer_required * PRIMER_COST_PER_GALLON

    total_internal_cost = paint_cost + primer_cost + SUPPLIES_COST
    profit = total_cost_to_customer - total_internal_cost
    painter_share = profit * 0.7
    app_share = profit * 0.3

    return {
        "total_cost_to_customer": total_cost_to_customer,
        "total_internal_cost": total_internal_cost,
        "profit": profit,
        "painter_share": painter_share,
        "app_share": app_share,
    }

# Example usage:
if __name__ == "__main__":
    cost_tiers = load_metro_cost_tiers("metro_cost_tiers.xlsx")
    num_rooms = int(input("Enter the number of rooms: "))
    square_footage = float(input("Enter the total square footage: "))
    num_coats = int(input("Enter the number of coats (1 or 2): "))
    metro_area = input("Enter your metropolitan area: ")

    try:
        results = calculate_paint_job_cost(num_rooms, square_footage, num_coats, metro_area, cost_tiers)
        print(f"Total cost to customer: ${results['total_cost_to_customer']:.2f}")
        print(f"Total internal cost: ${results['total_internal_cost']:.2f}")
        print(f"Profit: ${results['profit']:.2f}")
        print(f"Painter's share (70%): ${results['painter_share']:.2f}")
        print(f"App's share (30%): ${results['app_share']:.2f}")
    except ValueError as e:
        print(e)
